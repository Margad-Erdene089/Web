import Dashboard from "../components/Dashboard/Dashboard";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout state={0}>
      <Dashboard />
    </Layout>
  );
}
