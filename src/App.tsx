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
	const [hasGift, setHasGift] = useState(false);

	useEffect(() => {
		// Observe Gifts to check if the user has a gift
		client.models.Gift.observeQuery().subscribe({
			next: async (giftData) => {
				setHasGift(Boolean(giftData.items.find((gift) => gift?.ownerLoginId === user?.signInDetails?.loginId)));
			},
		});

		// Observe Persons to check if the user is admin
		client.models.Person.observeQuery().subscribe({
			next: async (personData) => {
				const person = personData.items.find((person) => person?.ownerLoginId === user?.signInDetails?.loginId);
				setIsAdmin(Boolean(person?.isAdmin));
			},
		});

		setTimeout(() => setAppLoading(false), 1000);
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
				hasGift ? (
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
