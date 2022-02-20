import "./App.css";
import Hero from "./Hero";
import { useState } from "react";
import Home from "./Home";

function App() {
	const [connecctstatus, setConnectedstatus] = useState(false);
	return (
		<>
			<Hero connecctstatus={connecctstatus} />
			<Home
				connecctstatus={connecctstatus}
				setConnectedstatus={setConnectedstatus}
			/>
		</>
	);
}

export default App;
