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
	const [people, setPeople] = useState<Array<Schema["Person"]["type"] | null>>([]);
	const { user } = useAuthenticator();


	useEffect(() => {
		client.models.Person.observeQuery().subscribe({
			next: (data) => setPeople([...data.items]),
		});
	}, []);

	function amAdmin() {
		return people?.find((person) => person?.ownerLoginId === user?.signInDetails?.loginId)?.isAdmin;
	}

	function amRegistered() {
		return people?.find((person) => person?.ownerLoginId === user?.signInDetails?.loginId);
	}

	if (!people)
		return <p>Loading...</p>;

	return (
		<main>
			<h1> Ciao {user?.signInDetails?.loginId} </h1>
			{
				amRegistered() ? (
					<PersonGift />
				) : (
					<RegisterGift />
				)
			}
			{
				amAdmin() ? (
					<PeopleGifts />
				) : (
					<BecomeAdmin />
				)
			}
		</main>
	);
}

export default App;
