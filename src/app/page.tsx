import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>My Secretary</h1>
          <p>
            Next.js, TypeScript, and App Router are ready so you can start
            building right away.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Docs
          </a>
          <a
            className={styles.secondary}
            href="https://vercel.com/templates/next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            Templates
          </a>
        </div>
      </main>
    </div>
  );
}
