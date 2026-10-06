import AddFolderButton from "./AddFolderButton";
import AddLinkButton from "./AddLinkButton";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-[var(--card)] px-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <span className="text-xl font-bold text-[var(--text)]">
        🔗 <span className="text-[var(--accent)]">링크</span>
      </span>
      <div className="flex items-center gap-2">
        <AddFolderButton />
        <AddLinkButton />
        <UserMenu />
      </div>
    </header>
  );
}
