import { useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function RegisterGift() {
	const { user } = useAuthenticator();

	const [giftData, setGiftData] = useState({
		name: '',
		attribute_1: '',
		attribute_2: '',
		attribute_3: '',
	});

	const [errors, setErrors] = useState({
		name: '',
		attribute_1: '',
		attribute_2: '',
		attribute_3: '',
	});

	function validateInputs() {
		const newErrors = {
			name: giftData.name.length < 3 ? 'At least 3 characters required' : '',
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
		const maxRetries = 1;
		let currentRetries = 0;
		while (currentRetries < maxRetries) {
			const { data: gift, errors: giftErrors } = await client.models.Gift.create({
				...giftData,
				ownerLoginId: user.signInDetails.loginId,
				number: (await client.models.Gift.list()).data.length + 1,
			});

			if (!gift) {
				if (giftErrors)
					console.error('Errore nella creazione del regalo: ' + giftErrors.map((e) => e.message).join('; '));

				currentRetries++;
				continue;
			}

			const { data: person, errors: personErrors } = await client.models.Person.create({
				isAdmin: false,
				ownerLoginId: user.signInDetails.loginId,
			});
			if (!person) {
				if (personErrors)
					console.error('Errore nella creazione della persona: ' + personErrors.map((e) => e.message).join('; '));
				continue;
			}

			break;
		}
	}

	return (
		<>
			<form>
				<div className="input-container"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '1rem',
					}}
				>
					<input
						type="text"
						placeholder="Name"
						value={giftData.name}
						onChange={(e) => setGiftData({ ...giftData, name: e.target.value })}
					/>
					{errors.name && <span>{errors.name}</span>}
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
					<div />
				</div>
			</form>
			<button onClick={register}>Registra regalo</button>
		</>
	);
}

export default RegisterGift;
