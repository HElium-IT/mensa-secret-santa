import { useEffect } from "react";
import { useWindowSize } from 'react-use';

import { Flex, ScrollView, View } from "@aws-amplify/ui-react";
import Header from "./components/Header";
import Main from "./components/Main";
import { useState } from "react";


function App() {
	const [shadowColor, setShadowColor] = useState("");
	const { width, height } = useWindowSize();

	useEffect(() => {
		const savedColor = localStorage.getItem("shadowColor");
		if (savedColor) {
			setShadowColor(savedColor);
		} else {
			setShadowColor("var(--amplify-colors-green-60)");
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("shadowColor", shadowColor);
	}, [shadowColor]);

	return (
		<main>
			<Flex direction="column" alignItems="stretch" alignContent="stretch" height="100dvh" gap="0px">
				{width < height
					&& <View
						as="div"
						backgroundColor="rgba(255, 255, 255, 0.97)"
						borderRadius="6px"
						border="1px solid var(--amplify-colors-red)"
						boxShadow={`0px 0px 6px 6px ${shadowColor}`}
						color="var(--amplify-colors-black-60)"
						padding="0.5rem"
						margin="0.5rem"
					>
						<Header setShadowColor={setShadowColor} />
					</View>
				}
				<ScrollView
					as="div"
					backgroundColor="rgba(255, 255, 255, 0.97)"
					borderRadius="6px"
					border="1px solid var(--amplify-colors-red)"
					boxShadow={`0px 0px 6px 6px ${shadowColor}`}
					color="var(--amplify-colors-black-60)"
					padding="0.5rem"
					margin="0.5rem"
				>
					<Main />
				</ScrollView>
			</Flex>
		</main >
	);
}

export default App;
