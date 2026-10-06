type Props = {
  name: string;
  active?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function FolderItem({
  name,
  active = false,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="folder-row relative">
      <button
        type="button"
        className={`folder-hover w-full rounded-xl px-3 py-2.5 text-left text-[15px] font-bold ${
          onDelete ? "pr-[4.5rem]" : ""
        } ${
          active
            ? "bg-[var(--hover-bg)] text-[var(--accent)]"
            : "text-[var(--text)]"
        }`}
      >
        {name}
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`${name} 폴더 이름 수정`}
          className="folder-action absolute top-1/2 right-9 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-sub)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`${name} 폴더 삭제`}
          className="folder-action folder-action-danger absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-sub)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      )}
    </div>
  );
}
