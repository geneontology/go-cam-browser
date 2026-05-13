import React from "react";

import styles from "./NoData.module.css";

interface NoDataProps {
  message?: string;
}

const NoData: React.FC<NoDataProps> = ({ message = "No Data" }) => {
  return <span className={styles.muted}>{message}</span>;
};

export default NoData;
