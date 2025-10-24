# Generating search data

Generating the GO-CAM search documents which drive this site happens in three steps:

1. Download a GO-CAM in Minerva format. These are produced as part of the GO release pipeline and stored in a publicly accessible S3 bucket. The `MinervaWrapper` class from [`gocam-py`](https://github.com/geneontology/gocam-py) provides convenience methods for accessing them.
2. Use the `MinervaWrapper` class to transform the Minerva object into a [`Model`](https://geneontology.github.io/gocam-py/Model/) instance (as defined by the LinkML schema), and use the `Indexer` class to populate the `query_index` slot of the `Model`.
3. Use the `Flattener` class from `gocam-py` to flatten and extract search-relevant fields of each `Model` instance. Concatenate the results and serialize to a single JSON file.

A basic Python script to implement these steps is:

```python
import json

from gocam.indexing.Flattener import Flattener
from gocam.indexing.Indexer import Indexer
from gocam.translation import MinervaWrapper

minerva_wrapper = MinervaWrapper()
indexer = Indexer()
# These fields must be kept in sync with what the front-end expects
flattener = Flattener(fields=[
    "id",
    "title",
    "taxon",
    "taxon_label",
    "status",
    "date_modified",
    "model_activity_part_of_rollup_label",
    "model_activity_occurs_in_rollup_label",
    "model_activity_enabled_by_terms_label",
    "number_of_activities",
    "length_of_longest_causal_association_path",
    "number_of_strongly_connected_components"
])

search_documents = []

# Iterate over all GO-CAM IDs in causal set
for id in minerva_wrapper.models_ids():
    # Download Minerva format
    minerva_obj = minerva_wrapper.fetch_minerva_object(id)

    # Convert from Minerva format to Model instance
    model = MinervaWrapper.minerva_object_to_model(minerva_obj)

    # Populate the Model.query_index slot
    indexer.index_model(model, reindex=True)

    # Flatten and extract search fields
    doc = flattener.flatten(model)

    # Front-end expects these to always be present, even if they're empty
    if "model_activity_part_of_rollup_label" not in doc:
        doc["model_activity_part_of_rollup_label"] = []
    if "model_activity_occurs_in_rollup_label" not in doc:
        doc["model_activity_occurs_in_rollup_label"] = []
    if "model_activity_enabled_by_terms_label" not in doc:
        doc["model_activity_enabled_by_terms_label"] = []

    search_documents.append(doc)

# Apply default sort and serialize to JSON
search_documents.sort(key=lambda m: m["date_modified"], reverse=True)
with open("data.json", "w") as f:
    json.dump(search_documents, f)
```
