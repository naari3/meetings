import Button from "./Button";

interface ViewToggleProps {
	view: "weekly" | "daily";
	setView: (view: "weekly" | "daily") => void;
}

export default function ViewToggle({ view, setView }: ViewToggleProps) {
	return (
		<div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex">
			<Button
				variant="viewToggle"
				active={view === "weekly"}
				onClick={() => setView("weekly")}
			>
				週表示
			</Button>
			<Button
				variant="viewToggle"
				active={view === "daily"}
				onClick={() => setView("daily")}
			>
				日表示
			</Button>
		</div>
	);
}
