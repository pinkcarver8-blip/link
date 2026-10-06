import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SavedLinkGrid from "./components/SavedLinkGrid";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <SavedLinkGrid />
      </div>
    </div>
  );
}
