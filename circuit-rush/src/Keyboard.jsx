import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function Keyboard({keyboardType}) {
	const keyboardRef = useRef(null);
	const keyboardTextRef = useRef(null);
	const prevCurrentState = useRef(1);
	const [changeableState, setChangeableState] = useState(false); 
	const keyboardAzerty = 'movement-key-azerty';
	const keyboardQwerty = 'movement-key-qwerty';
	const [currentState, setCurrentState] = useState(1);
	const [movementUp, setMovementUp] = useState(null);
	const [movementLeft, setMovementLeft] = useState(null);

	const animationSettings = {
		1: { className: 'movement', keyClassName: 'movement-key', text: 'Movement', onComplete: () => setCurrentState(2) },
		2: { className: 'brake', keyClassName: 'brake-key', text: 'Brake', onComplete: () => setCurrentState(3) },
		3: { className: 'camera', keyClassName: 'camera-key', text: 'Change camera', onComplete: () => setCurrentState(4) },
		4: { className: 'reset', keyClassName: 'reset-key', text: 'Reset car', onComplete: () => setCurrentState(5) },
		5: { className: 'pause', keyClassName: 'pause-key', text: 'Pause', onComplete: () => setCurrentState(6) },
		6: { className: 'escape', keyClassName: 'escape-key', text: 'Quit game', onComplete: () => setCurrentState(1) }
	};

	useEffect(() => {
    if (keyboardType) {
      const elements = keyboardRef.current.querySelectorAll(`.${keyboardQwerty}`);
			setMovementUp('z');
			setMovementLeft('q');
      elements.forEach((element) => {
        element.style.opacity = 0;
      });
    } else {
			const elements = keyboardRef.current.querySelectorAll(`.${keyboardAzerty}`);
			setMovementUp('w');
			setMovementLeft('a');
      elements.forEach((element) => {
        element.style.opacity = 0;
      });
		}
  }, [keyboardType]);
	
	useEffect(() => {
		prevCurrentState.current = currentState;
		const { className, keyClassName, text } = animationSettings[currentState];
		const elements = keyboardRef.current.querySelectorAll(`.${className}`);
		const keyElements = currentState === 1
			? keyboardRef.current.querySelectorAll(`.${keyboardType ? keyboardAzerty : keyboardQwerty}, .${keyClassName}`)
			: keyboardRef.current.querySelectorAll(`.${keyClassName}`);
		setChangeableState(false);

		elements.forEach((element) => {
			gsap.to(element, {
				fill: '#e55555',
				duration: 1,
				delay: 1,
				onComplete: () => {
					setChangeableState(true);
					gsap.delayedCall(3, () => {
						fadeOutElements(currentState, false);
					});
				},
			});
		});

		keyElements.forEach((element) => {
			gsap.to(element, {
				fill: '#fff',
				duration: 1,
				delay: 1,
				onComplete: () => {
					gsap.delayedCall(3, () => {
						fadeOutKeys(currentState, false);
					});
				},
			});
		});

		gsap.delayedCall(1, () => {
			if (keyboardTextRef.current)
			keyboardTextRef.current.innerHTML = text;
		});

		gsap.fromTo(
			keyboardTextRef.current,
			{
				y: '-10%',
				opacity: 0,
			},
			{
				y: '0%',
				opacity: 1,
				duration: 1,
				delay: 1,
				onComplete: () => {
					gsap.delayedCall(3, () => {
						fadeOutText();
					});
				},
			}
		);
	}, [currentState]);

	const fadeOutElements = (prevState, bool) => {
		if (prevState === prevCurrentState.current && keyboardRef.current && !bool) {
			const { className, onComplete } = animationSettings[currentState];
			onComplete();
			const elements = keyboardRef.current.querySelectorAll(`.${className}`);
			elements.forEach((element) => {
				gsap.to(element, {
					fill: '#f7f7f7',
					duration: 1
				});
			});
		} else if (keyboardRef.current) {
			const { className } = animationSettings[prevState];
			const elements = keyboardRef.current.querySelectorAll(`.${className}`);
			elements.forEach((element) => {
				gsap.to(element, {
					fill: '#f7f7f7',
					duration: 1
				});
			});
		}
	};

	const fadeOutKeys = (prevState) => {
		if (currentState === prevCurrentState.current  && keyboardRef.current) {
			const { keyClassName } = animationSettings[prevState];
			const keyElements = prevState === 1
				? keyboardRef.current.querySelectorAll(`.${keyboardType ? keyboardAzerty : keyboardQwerty}, .${keyClassName}`)
				: keyboardRef.current.querySelectorAll(`.${keyClassName}`);
			keyElements.forEach((element) => {
				gsap.to(element, {
					fill: '#aaaaaa',
					duration: 1
				});
			});
		} 
	};

	const fadeOutText = () => {
		if (currentState === prevCurrentState.current && keyboardRef.current) {
			gsap.to(keyboardTextRef.current, {
				y: '-10%',
				opacity: 0,
				duration: 1
			});
		}
	};

	const handleKeyPress = (newState) => {
		setCurrentState((prevState) => {
			fadeOutKeys(prevState, true);
			fadeOutElements(prevState, true);
			return newState;
		});
	};

	useEffect(() => {
		if(!changeableState) return;
		const handleKeyDown = (event) => {
			const key = event.key.toLowerCase();;
			if (currentState !== 1 && (key === movementUp || key === movementLeft || key === 's' || key === 'd' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' || key === 'arrowup')) {
				handleKeyPress(1);
			} else if (currentState !== 2 && key === ' ') {
				handleKeyPress(2);
			} else if (currentState !== 3 && key === 'c') {
				handleKeyPress(3);
			} else if (currentState !== 4 && key === 'r') {
				handleKeyPress(4);
			} else if (currentState !== 5 && key === 'p') {
				handleKeyPress(5);
			} else if (currentState !== 6 && key === 'escape') {
				handleKeyPress(6);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [changeableState]);

  return (
    <>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2519.5 817.5" ref={keyboardRef}>
				<g id="keyboard">
					<rect className="cls-1" width="2519.5" height="817.5" rx="12" ry="12"/>
					<g>
						<rect className="cls-2" x="168" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m320,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="330" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m482,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="492" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m644,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="654" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m806,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="816" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m968,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="978" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1130,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1140" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1292,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1302" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1454,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1464" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1616,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1626" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1778,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1788" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1940,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1950" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2102,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2111.5" y="5.75" width="240" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2345.5,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-228c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h228m0-4h-228c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h228c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2355.5" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2507.5,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="6" y="167.75" width="239.5" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m239.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4H12c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h227.5m0-4H12c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h227.5c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="6" y="329.75" width="281.5" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m281.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4H12c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h269.5m0-4H12c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h269.5c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="6" y="491.75" width="362.5" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m362.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4H12c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h350.5m0-4H12c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h350.5c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="249.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m401.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="573.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m725.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="897.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1049.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1059.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1211.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1221.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1373.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1383.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1535.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1545.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1697.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1869.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2021.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2031.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2183.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2193.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2345.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2355.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2507.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2355.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2507.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2355.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2507.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1869.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2021.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1707.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1859.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="372.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m524.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="534.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m686.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="534.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m686.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="6" y="653.75" width="200.5" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m200.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4H12c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h188.5m0-4H12c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h188.5c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="210.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m362.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="372.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m524.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="858.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1010.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1020.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1172.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1182.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1334.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1506.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1658.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1344.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1496.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1668.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1820.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1830.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1982.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1992.5" y="491.75" width="197" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2183.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-185c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h185m0-4h-185c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h185c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="777.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m929.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="939.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1091.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1263.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1415.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1425.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1577.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1587.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1739.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1749.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1901.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1911.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2063.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="2073.5" y="329.75" width="278" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2345.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-266c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h266m0-4h-266c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h266c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
					<g>
						<rect className="cls-2" x="1101.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1253.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 escape" x="6" y="5.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m158,7.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4H12c-2.21,0-4-1.79-4-4V11.75c0-2.21,1.79-4,4-4h146m0-4H12c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8V11.75c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="411.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m563.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 reset" x="735.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m887.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 pause" x="1707.5" y="167.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1859.5,169.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="2355.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2507.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="2193.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2345.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="2193.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2345.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="2031.5" y="653.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m2183.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="291.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m443.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 brake" x="696.5" y="653.75" width="1007" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m1697.5,655.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-995c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h995m0-4h-995c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h995c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 camera" x="696.5" y="491.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m848.5,493.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="453.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m605.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<g>
						<rect className="cls-6 movement" x="615.5" y="329.75" width="158" height="158" rx="6" ry="6"/>
						<path className="cls-7" d="m767.5,331.75c2.21,0,4,1.79,4,4v146c0,2.21-1.79,4-4,4h-146c-2.21,0-4-1.79-4-4v-146c0-2.21,1.79-4,4-4h146m0-4h-146c-4.42,0-8,3.58-8,8v146c0,4.42,3.58,8,8,8h146c4.42,0,8-3.58,8-8v-146c0-4.42-3.58-8-8-8h0Z"/>
					</g>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key-qwerty" d="m471.53,221.55h7.63l3.53,38.74h.14l3.74-38.74h8.64l3.74,38.74h.14l3.53-38.74h6.84l-5.11,50.4h-9.86l-3.6-33.98h-.14l-3.6,33.98h-10.51l-5.11-50.4Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-3 movement-key-azerty" d="m478.91,264.89l14.69-36.14h-13.97v-7.2h22.46v7.06l-14.69,36.14h14.69v7.2h-23.18v-7.06Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key-azerty" d="m374.78,431.83c-1.49.58-3.24.86-5.26.86-3.89,0-6.86-1.1-8.93-3.31-2.06-2.21-3.1-5.33-3.1-9.36v-26.5c0-4.03,1.03-7.15,3.1-9.36,2.06-2.21,5.04-3.31,8.93-3.31s6.86,1.1,8.93,3.31c2.06,2.21,3.1,5.33,3.1,9.36v26.5c0,3.36-.74,6.12-2.23,8.28.29.48.65.79,1.08.94.43.14,1.06.22,1.87.22h1.22v7.2h-2.09c-3.6,0-5.81-1.61-6.62-4.82Zm-1.15-11.3v-27.5c0-3.31-1.37-4.97-4.1-4.97s-4.1,1.66-4.1,4.97v27.5c0,3.31,1.37,4.97,4.1,4.97s4.1-1.66,4.1-4.97Z"/>
				</g>
				<g>
					<path data-name="escape-key" className="cls-4 escape-key" d="m47.06,59.55h21.6v7.2h-13.68v13.32h10.87v7.2h-10.87v15.48h13.68v7.2h-21.6v-50.4Z"/>
				</g>
				<g>
					<path data-name="escape-key" className="cls-4 escape-key" d="m74.92,107.39c-1.97-2.18-2.95-5.32-2.95-9.4v-2.88h7.49v3.46c0,3.26,1.37,4.9,4.1,4.9,1.34,0,2.36-.4,3.06-1.19.7-.79,1.04-2.08,1.04-3.85,0-2.11-.48-3.97-1.44-5.58-.96-1.61-2.74-3.54-5.33-5.8-3.27-2.88-5.54-5.48-6.84-7.81-1.3-2.33-1.94-4.96-1.94-7.88,0-3.98,1.01-7.07,3.02-9.25,2.02-2.18,4.94-3.28,8.78-3.28s6.66,1.09,8.6,3.28c1.94,2.19,2.92,5.32,2.92,9.4v2.09h-7.49v-2.59c0-1.73-.34-2.99-1.01-3.78-.67-.79-1.66-1.19-2.95-1.19-2.64,0-3.96,1.61-3.96,4.82,0,1.82.49,3.53,1.48,5.11.98,1.58,2.77,3.5,5.36,5.76,3.31,2.88,5.59,5.5,6.84,7.85,1.25,2.35,1.87,5.11,1.87,8.28,0,4.13-1.02,7.3-3.06,9.5-2.04,2.21-5,3.31-8.89,3.31s-6.74-1.09-8.71-3.28Z"/>
				</g>
				<g>
					<path data-name="escape-key" className="cls-4 escape-key" d="m102.6,107.43c-1.99-2.16-2.99-5.21-2.99-9.14v-27.07c0-3.94,1-6.98,2.99-9.14,1.99-2.16,4.88-3.24,8.68-3.24s6.68,1.08,8.68,3.24c1.99,2.16,2.99,5.21,2.99,9.14v5.33h-7.49v-5.83c0-3.12-1.32-4.68-3.96-4.68s-3.96,1.56-3.96,4.68v28.15c0,3.07,1.32,4.61,3.96,4.61s3.96-1.54,3.96-4.61v-7.7h7.49v7.13c0,3.94-1,6.98-2.99,9.14-1.99,2.16-4.88,3.24-8.68,3.24s-6.68-1.08-8.68-3.24Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key-qwerty" d="m365.14,383.55h10.73l8.21,50.4h-7.92l-1.44-10.01v.14h-9l-1.44,9.86h-7.34l8.21-50.4Zm8.64,33.7l-3.53-24.91h-.14l-3.46,24.91h7.13Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key" d="m523.64,431.39c-1.97-2.18-2.95-5.32-2.95-9.4v-2.88h7.49v3.46c0,3.26,1.37,4.9,4.1,4.9,1.34,0,2.36-.4,3.06-1.19.7-.79,1.04-2.08,1.04-3.85,0-2.11-.48-3.97-1.44-5.58-.96-1.61-2.74-3.54-5.33-5.8-3.26-2.88-5.54-5.48-6.84-7.81s-1.94-4.96-1.94-7.88c0-3.98,1.01-7.07,3.02-9.25,2.02-2.18,4.94-3.28,8.78-3.28s6.66,1.09,8.6,3.28c1.94,2.19,2.92,5.32,2.92,9.4v2.09h-7.49v-2.59c0-1.73-.34-2.99-1.01-3.78-.67-.79-1.66-1.19-2.95-1.19-2.64,0-3.96,1.61-3.96,4.82,0,1.83.49,3.53,1.48,5.11.98,1.58,2.77,3.5,5.36,5.76,3.31,2.88,5.59,5.5,6.84,7.85,1.25,2.35,1.87,5.11,1.87,8.28,0,4.13-1.02,7.3-3.06,9.5-2.04,2.21-5,3.31-8.89,3.31s-6.75-1.09-8.71-3.28Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key" d="m682.55,383.55h12.1c3.94,0,6.89,1.06,8.86,3.17,1.97,2.11,2.95,5.21,2.95,9.29v25.49c0,4.08-.98,7.18-2.95,9.29-1.97,2.11-4.92,3.17-8.86,3.17h-12.1v-50.4Zm11.95,43.2c1.3,0,2.29-.38,2.99-1.15.7-.77,1.04-2.02,1.04-3.74v-26.21c0-1.73-.35-2.98-1.04-3.74-.7-.77-1.69-1.15-2.99-1.15h-4.03v36h4.03Z"/>
				</g>
				<g>
					<path data-name="reset-key" className="cls-4 reset-key" d="m802.3,221.55h11.74c4.08,0,7.06.95,8.93,2.84,1.87,1.9,2.81,4.81,2.81,8.75v3.1c0,5.23-1.73,8.54-5.18,9.94v.14c1.92.58,3.28,1.75,4.07,3.53.79,1.78,1.19,4.15,1.19,7.13v8.86c0,1.44.05,2.6.14,3.49.1.89.33,1.76.72,2.63h-8.06c-.29-.82-.48-1.58-.58-2.3-.1-.72-.14-2.02-.14-3.89v-9.22c0-2.3-.37-3.91-1.12-4.82-.74-.91-2.03-1.37-3.85-1.37h-2.74v21.6h-7.92v-50.4Zm10.8,21.6c1.58,0,2.77-.41,3.56-1.22.79-.82,1.19-2.18,1.19-4.1v-3.89c0-1.82-.32-3.14-.97-3.96-.65-.82-1.67-1.22-3.06-1.22h-3.6v14.4h2.88Z"/>
				</g>
				<g>
					<path data-name="camera-key" className="cls-4 camera-key" d="m766.82,593.43c-1.99-2.16-2.99-5.21-2.99-9.14v-27.07c0-3.94,1-6.98,2.99-9.14,1.99-2.16,4.88-3.24,8.68-3.24s6.68,1.08,8.68,3.24c1.99,2.16,2.99,5.21,2.99,9.14v5.33h-7.49v-5.83c0-3.12-1.32-4.68-3.96-4.68s-3.96,1.56-3.96,4.68v28.15c0,3.07,1.32,4.61,3.96,4.61s3.96-1.54,3.96-4.61v-7.7h7.49v7.13c0,3.94-1,6.98-2.99,9.14-1.99,2.16-4.88,3.24-8.68,3.24s-6.68-1.08-8.68-3.24Z"/>
				</g>
				<g>
					<path data-name="pause-key" className="cls-4 pause-key" d="m1774.76,221.55h11.66c3.94,0,6.89,1.06,8.86,3.17,1.97,2.11,2.95,5.21,2.95,9.29v4.97c0,4.08-.98,7.18-2.95,9.29-1.97,2.11-4.92,3.17-8.86,3.17h-3.74v20.52h-7.92v-50.4Zm11.66,22.68c1.3,0,2.27-.36,2.92-1.08.65-.72.97-1.94.97-3.67v-5.98c0-1.73-.32-2.95-.97-3.67-.65-.72-1.62-1.08-2.92-1.08h-3.74v15.48h3.74Z"/>
				</g>
				<g>
					<path data-name="brake-key" className="cls-4 brake-key" d="m1137.29,755.39c-1.97-2.18-2.95-5.32-2.95-9.4v-2.88h7.49v3.46c0,3.26,1.37,4.9,4.1,4.9,1.34,0,2.36-.4,3.06-1.19.7-.79,1.04-2.08,1.04-3.85,0-2.11-.48-3.97-1.44-5.58-.96-1.61-2.74-3.54-5.33-5.8-3.27-2.88-5.54-5.48-6.84-7.81-1.3-2.33-1.94-4.96-1.94-7.88,0-3.98,1.01-7.07,3.02-9.25,2.02-2.18,4.94-3.28,8.78-3.28s6.66,1.09,8.6,3.28c1.94,2.18,2.92,5.32,2.92,9.4v2.09h-7.49v-2.59c0-1.73-.34-2.99-1.01-3.78-.67-.79-1.66-1.19-2.95-1.19-2.64,0-3.96,1.61-3.96,4.82,0,1.82.49,3.53,1.48,5.11.98,1.58,2.77,3.5,5.36,5.76,3.31,2.88,5.59,5.5,6.84,7.85,1.25,2.35,1.87,5.11,1.87,8.28,0,4.13-1.02,7.3-3.06,9.5-2.04,2.21-5,3.31-8.89,3.31s-6.74-1.09-8.71-3.28Z"/>
				</g>
				<g>
					<path data-name="brake-key" className="cls-4 brake-key" d="m1162.49,707.55h11.66c3.94,0,6.89,1.06,8.86,3.17,1.97,2.11,2.95,5.21,2.95,9.29v4.97c0,4.08-.98,7.18-2.95,9.29-1.97,2.11-4.92,3.17-8.86,3.17h-3.74v20.52h-7.92v-50.4Zm11.66,22.68c1.3,0,2.27-.36,2.92-1.08.65-.72.97-1.94.97-3.67v-5.98c0-1.73-.32-2.95-.97-3.67-.65-.72-1.62-1.08-2.92-1.08h-3.74v15.48h3.74Z"/>
				</g>
				<g>
					<path data-name="brake-key" className="cls-4 brake-key" d="m1193.88,707.55h10.73l8.21,50.4h-7.92l-1.44-10.01v.14h-9l-1.44,9.86h-7.34l8.21-50.4Zm8.64,33.7l-3.53-24.91h-.14l-3.46,24.91h7.13Z"/>
				</g>
				<g>
					<path data-name="brake-key" className="cls-4 brake-key" d="m1218.97,755.43c-1.99-2.16-2.99-5.21-2.99-9.14v-27.07c0-3.94,1-6.98,2.99-9.14,1.99-2.16,4.88-3.24,8.68-3.24s6.68,1.08,8.68,3.24c1.99,2.16,2.99,5.21,2.99,9.14v5.33h-7.49v-5.83c0-3.12-1.32-4.68-3.96-4.68s-3.96,1.56-3.96,4.68v28.15c0,3.07,1.32,4.61,3.96,4.61s3.96-1.54,3.96-4.61v-7.7h7.49v7.13c0,3.94-1,6.98-2.99,9.14-1.99,2.16-4.88,3.24-8.68,3.24s-6.68-1.08-8.68-3.24Z"/>
				</g>
				<g>
					<path data-name="brake-key" className="cls-4 brake-key" d="m1244.06,707.55h21.6v7.2h-13.68v13.32h10.87v7.2h-10.87v15.48h13.68v7.2h-21.6v-50.4Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key" d="m2290.5,564.75l-4.35,4.2-10.65-10.65v36.45h-6v-36.45l-10.65,10.65-4.35-4.2,18-18,18,18Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key" d="m2254.5,738.75l4.35-4.2,10.65,10.65v-36.45s6,0,6,0v36.45s10.65-10.65,10.65-10.65l4.35,4.2-18,18-18-18Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key" d="m2104.5,714.75l4.2,4.35-10.65,10.65h36.45s0,6,0,6h-36.45s10.65,10.65,10.65,10.65l-4.2,4.35-18-18,18-18Z"/>
				</g>
				<g>
					<path data-name="movement-key" className="cls-4 movement-key" d="m2440.5,750.75l-4.2-4.35,10.65-10.65h-36.45s0-6,0-6h36.45s-10.65-10.65-10.65-10.65l4.2-4.35,18,18-18,18Z"/>
				</g>
			</svg>
			<p ref={keyboardTextRef} className={'keyboard-info'}></p>
    </>
  );
}
