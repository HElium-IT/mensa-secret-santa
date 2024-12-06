import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import BecomeAdmin from "./components/BecomeAdmin";
import RegisterGift from "./components/RegisterGift";
import PeopleGifts from "./components/PeopleGifts";
import PersonGift from "./components/PersonGift";
import GameAdminPanel from "./components/GameAdminPanel";

const client = generateClient<Schema>();

function App() {
	const [hasGift, setHasGift] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const { user } = useAuthenticator();
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		// Observe Gifts to check if the user has a gift
		client.models.Gift.observeQuery().subscribe({
			next: (giftData) => {
				setHasGift(Boolean(giftData.items.find((gift) => gift?.ownerLoginId === user?.signInDetails?.loginId)));
			},
		});

		// Observe Persons to check if the user is admin
		client.models.Person.observeQuery().subscribe({
			next: (personData) => {
				const person = personData.items.find((person) => person?.ownerLoginId === user?.signInDetails?.loginId);
				setIsAdmin(Boolean(person?.isAdmin));
			},
		});

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
			{
				hasGift ? (
					<PersonGift />
				) : (
					<RegisterGift />
				)
			}
			{
				isAdmin ? (
					<>
						<PeopleGifts />
						<GameAdminPanel />
					</>
				) : (
					<BecomeAdmin />
				)
			}
		</main>
	);
}

export default App;
