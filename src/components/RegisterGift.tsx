import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function RegisterGift() {
	const [gifts, setGifts] = useState<Array<Schema["Gift"]["type"]>>([]);
	const { user } = useAuthenticator();

	const [giftData, setGiftData] = useState({
		attribute_1: '',
		attribute_2: '',
		attribute_3: '',
	});

	const [errors, setErrors] = useState({
		attribute_1: '',
		attribute_2: '',
		attribute_3: '',
	});

	useEffect(() => {
		client.models.Gift.observeQuery().subscribe({
			next: (data) => setGifts([...data.items]),
		});
	}, []);

	function validateInputs() {
		const newErrors = {
			attribute_1: giftData.attribute_1.length < 3 ? 'At least 3 characters required' : '',
			attribute_2: giftData.attribute_2.length < 3 ? 'At least 3 characters required' : '',
			attribute_3: giftData.attribute_3.length < 3 ? 'At least 3 characters required' : '',
		};
		setErrors(newErrors);
		return !Object.values(newErrors).some(error => error);
	}

	async function register() {
		if (!user.signInDetails?.loginId) {
			alert('Devi effettuare il login per registrare un regalo');
			return;
		}

		if (!validateInputs()) {
			alert('Please fix the validation errors before submitting.');
			return;
		}

		const newNumber = gifts.length + 1;

		const { data: gift, errors: giftErrors } = await client.models.Gift.create({
			...giftData,
			number: newNumber,
			ownerLoginId: user.signInDetails.loginId
		});
		if (!gift) {
			if (giftErrors)
				alert('Errore nella creazione del regalo: ' + giftErrors.map((e) => e.message).join('; '));
			return;
		}

		const { data: person, errors: personErrors } = await client.models.Person.create({
			isAdmin: false,
			ownerLoginId: user.signInDetails.loginId,
			giftNumber: newNumber
		});
		if (!person) {
			if (personErrors)
				alert('Errore nella creazione della persona: ' + personErrors.map((e) => e.message).join('; '));
			return;
		}
	}

	return (
		<>
			<form>
				<input
					type="text"
					placeholder="Attribute 1"
					value={giftData.attribute_1}
					onChange={(e) => setGiftData({ ...giftData, attribute_1: e.target.value })}
				/>
				{errors.attribute_1 && <span>{errors.attribute_1}</span>}
				<input
					type="text"
					placeholder="Attribute 2"
					value={giftData.attribute_2}
					onChange={(e) => setGiftData({ ...giftData, attribute_2: e.target.value })}
				/>
				{errors.attribute_2 && <span>{errors.attribute_2}</span>}
				<input
					type="text"
					placeholder="Attribute 3"
					value={giftData.attribute_3}
					onChange={(e) => setGiftData({ ...giftData, attribute_3: e.target.value })}
				/>
				{errors.attribute_3 && <span>{errors.attribute_3}</span>}
			</form>
			<button onClick={register}>Registra regalo</button>
		</>
	);
}

export default RegisterGift;
