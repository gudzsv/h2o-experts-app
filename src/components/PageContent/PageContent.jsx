import styles from './PageContent.module.css';

const PageContent = ({ children }) => (
  <div className={styles.pageContentWrapper}>{children}</div>
);

export default PageContent;
