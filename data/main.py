import json
import shutil
from pathlib import Path
from typing import Annotated

import typer
from gocam.datamodel import Model
from gocam.indexing.Flattener import Flattener
from gocam.indexing.Indexer import Indexer
from gocam.translation import MinervaWrapper
from gocam.utils import remove_species_code_suffix
from rich.progress import track

app = typer.Typer()

here = Path(__file__).parent
local_input_dir = here / "input"
local_output_dir = here / "output"


def download_latest_release_gocams(destination: Path) -> None:
    """Download GO-CAMs in Minerva format from the latest release."""
    minerva_wrapper = MinervaWrapper()
    gocam_ids = list(minerva_wrapper.models_ids())
    for gocam_id in track(gocam_ids, description="Downloading GO-CAMs..."):
        minerva_object = minerva_wrapper.fetch_minerva_object(gocam_id)
        with open(destination / f"{gocam_id}.json", "w") as f:
            json.dump(minerva_object, f)


def generate_indexed_models(indexer: Indexer, source: Path, destination: Path) -> None:
    """Generate indexed Model instances from Minerva JSON files."""
    minerva_wrapper = MinervaWrapper()
    gocam_files = list(source.glob("*.json"))
    for gocam_file in track(gocam_files, description="Generating indexed models..."):
        with open(gocam_file, "r") as f:
            minerva_object = json.load(f)

        model = minerva_wrapper.minerva_object_to_model(minerva_object)
        indexer.index_model(model)

        with open(destination / gocam_file.name, "w") as f:
            f.write(model.model_dump_json())


def generate_search_documents(source: Path, destination: Path) -> None:
    """Generate search documents from indexed Model instances."""
    array_fields = [
        "model_activity_enabled_by_genes_label",
        "model_activity_enabled_by_genes_id",
        "model_activity_occurs_in_rollup_label",
        "model_activity_occurs_in_terms_label",
        "model_activity_occurs_in_terms_id",
        "model_activity_part_of_rollup_label",
        "model_activity_part_of_terms_label",
        "model_activity_part_of_terms_id",
    ]
    flattener = Flattener(
        fields=[
            "date_modified",
            "id",
            "length_of_longest_causal_association_path",
            "number_of_activities",
            "number_of_strongly_connected_components",
            "status",
            "taxon",
            "taxon_label",
            "title",
        ]
        + array_fields
    )
    results = []
    indexed_files = list(source.glob("*.json"))
    for indexed_file in track(
        indexed_files, description="Generating search documents..."
    ):
        with open(indexed_file, "r") as f:
            model_json = f.read()

        model = Model.model_validate_json(model_json)
        flattened = flattener.flatten(model)
        # Ensure required list fields are present and sorted
        for field in array_fields:
            if field not in flattened:
                flattened[field] = []

        genes_label_field = "model_activity_enabled_by_genes_label"
        flattened[genes_label_field] = [
            remove_species_code_suffix(label) for label in flattened[genes_label_field]
        ]

        results.append(flattened)

    results.sort(key=lambda m: m["date_modified"], reverse=True)
    with open(destination, "w") as f:
        json.dump(results, f)


@app.command()
def main(
    download: Annotated[
        bool,
        typer.Option(
            help="Download GO-CAMs in Minerva format into minerva_directory. If --no-download, Minerva format files should already exist in minerva_directory"
        ),
    ] = False,
    index: Annotated[
        bool,
        typer.Option(
            help="Convert GO-CAMs from Minerva format (in minerva_directory) to LinkML format and store in indexed_directory. If --no-index, indexed LinkML GO-CAMs should already exist in indexed_directory. If --download is provided, indexing will be performed regardless of this setting.",
        ),
    ] = False,
    minerva_directory: Annotated[
        Path,
        typer.Option(
            help="Directory to store or read GO-CAMs in Minerva format",
            dir_okay=True,
            file_okay=False,
        ),
    ] = local_input_dir / "minerva",
    indexed_directory: Annotated[
        Path,
        typer.Option(
            help="Directory to store or read indexed GO-CAMs in LinkML format",
            dir_okay=True,
            file_okay=False,
        ),
    ] = local_input_dir / "indexed",
    output_directory: Annotated[
        Path,
        typer.Option(
            help="Directory to store generated search documents file",
            dir_okay=True,
            file_okay=False,
        ),
    ] = local_output_dir,
    go_adapater_descriptor: Annotated[
        str,
        typer.Option(
            help="OAK adapter descriptor for GO. See: https://incatools.github.io/ontology-access-kit/packages/selectors.html#ontology-adapter-selectors",
        ),
    ] = "sqlite:obo:go",
    ncbi_taxon_adapter_descriptor: Annotated[
        str,
        typer.Option(
            help="OAK adapter descriptor for the NCBITaxon ontology. See: https://incatools.github.io/ontology-access-kit/packages/selectors.html#ontology-adapter-selectors",
        ),
    ] = "sqlite:obo:ncbitaxon",
) -> None:
    """Generate search documents from GO-CAM models."""
    if download:
        shutil.rmtree(minerva_directory, ignore_errors=True)
        minerva_directory.mkdir(exist_ok=True, parents=True)
        download_latest_release_gocams(minerva_directory)

    if download or index:
        shutil.rmtree(indexed_directory, ignore_errors=True)
        indexed_directory.mkdir(exist_ok=True, parents=True)
        indexer = Indexer(
            go_adapter_descriptor=go_adapater_descriptor,
            ncbi_taxon_adapter_descriptor=ncbi_taxon_adapter_descriptor,
        )
        generate_indexed_models(indexer, minerva_directory, indexed_directory)

    output_directory.mkdir(exist_ok=True, parents=True)
    generate_search_documents(indexed_directory, output_directory / "data.json")


if __name__ == "__main__":
    app()
