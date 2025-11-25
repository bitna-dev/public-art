import { useState } from "react";
import List from "./List";
import Create from "./Create";
import Detail from "./Detail";
import Edit from "./Edit";

const App = (props) => {
	const [picked, setPicked] = useState(null);
	const [mode, setMode] = useState(null);

	return (
		<div className="wrapper">
			<List setMode={setMode} mode={mode} setPicked={setPicked} />
			{mode == "detail" && <Detail setMode={setMode} picked={picked} setPicked={setPicked} />}
			{mode == "edit" && <Edit setMode={setMode} picked={picked} setPicked={setPicked} />}
			{mode == "create" && <Create setMode={setMode} />}
		</div>
	);
};

export default App;
