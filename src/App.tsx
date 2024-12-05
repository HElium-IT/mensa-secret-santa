import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import BecomeAdmin from "./components/BecomeAdmin";
import RegisterGift from "./components/RegisterGift";
import PeopleGifts from "./components/PeopleGifts";
import PersonGift from "./components/PersonGift";

const client = generateClient<Schema>();

function App() {
	const { user } = useAuthenticator();

	const [appLoading, setAppLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);

	useEffect(() => {
		client.models.Person.observeQuery().subscribe({
			next: async (data) => {
				setIsRegistered(Boolean(data.items.find((person) => person?.ownerLoginId === user?.signInDetails?.loginId)));
				setIsAdmin(Boolean(data.items.find((person) => person?.ownerLoginId === user?.signInDetails?.loginId)?.isAdmin));
				setTimeout(() => setAppLoading(false), 1000);
			},
		});
	}, []);


	if (appLoading)
		return (
			<main>
				<h1> Ciao {user?.signInDetails?.loginId} </h1>
				<h2> Sto caricando i dati necessari...</h2>
			</main>
		)

	return (
		<main>
			<h1> Ciao {user?.signInDetails?.loginId} </h1>
			{
				isRegistered ? (
					<PersonGift />
				) : (
					<RegisterGift />
				)
			}
			{
				isAdmin ? (
					<PeopleGifts />
				) : (
					<BecomeAdmin />
				)
			}
		</main>
	);
}

export default App;
