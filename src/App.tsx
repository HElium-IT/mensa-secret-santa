import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';

import GamesList from "./components/GamesList";

function App() {

	const { user } = useAuthenticator();
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);

	}, []);

	if (loading) {
		return (
			<div className="loading">Loading...</div>
		);
	}

	return (
		<main>
			{/* <DevelToolbox /> */}
			<h1> Ciao {user?.signInDetails?.loginId} </h1>
			<GamesList />
		</main>
	);
}

export default App;
