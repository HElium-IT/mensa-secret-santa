import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { DEBUG } from "./main";
import { Game, GameSelector, GameCreate, GamesList } from "./components";

const client = generateClient<Schema>();


function App() {
	const { user } = useAuthenticator();
	const [loading, setLoading] = useState(true);
	const [person, setPerson] = useState<Schema["Person"]["type"]>();
	const [selectedGame, setSelectedGame] = useState<Schema["Game"]["type"]>();

	const [isSelectingGame, setIsSelectingGame] = useState(true);
	const [isCreatingGame, setIsCreatingGame] = useState(false);

	useEffect(() => {
		if (!user) return;
		console.debug("User", user);
		const subscription = client.models.Person.observeQuery({
			filter: {
				ownerLoginId: { eq: user.signInDetails?.loginId }
			}
		}).subscribe({
			next: ({ items }) => {
				if (items.length === 0) {
					client.models.Person.create({
						ownerLoginId: user.signInDetails?.loginId as string,
						isAdmin: user.signInDetails?.loginId === "elio.palomba.dev@gmail.com",
					});
				} else if (items.length > 1) {
					throw new Error("More than one person with the same ownerLoginId");
				} else {
					console.debug("Person", items[0]);
					setPerson(items[0]);
					if (DEBUG && !items[0].isAdmin) {
						client.models.Person.update({
							...items[0],
							isAdmin: user.signInDetails?.loginId === "elio.palomba.dev@gmail.com",
						})
					}
				}
			}
		});

		setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => subscription.unsubscribe();
	}, [user]);


	if (loading) {
		return (
			<div className="loading">Loading...</div>
		);
	}

	async function selectGame(game?: Schema["Game"]["type"]) {
		console.debug("Game", { ...game, secret: "***" });
		setSelectedGame(game);
	}

	if (selectedGame) {
		return (
			<main className={"card game"}>
				<Game game={selectedGame} onDelete={() => selectGame()} />

			</main>
		)
	}


	return (
		<main className={"card"}>
			<h1 style={{ textAlign: "center" }}>
				{user?.signInDetails?.loginId?.split('@')[0]}
			</h1>
			{person?.isAdmin && !isSelectingGame && <GameCreate setIsCreatingGame={setIsCreatingGame} />}
			{!isCreatingGame && <GameSelector setGame={selectGame} setIsSelectingGame={setIsSelectingGame} />}
			{!isCreatingGame && !isSelectingGame && <GamesList setGame={selectGame} />}
		</main>
	);
}

export default App;
