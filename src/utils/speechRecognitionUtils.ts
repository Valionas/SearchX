export function startSpeechRecognition(
    setIsListening: React.Dispatch<React.SetStateAction<boolean>>,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    stopListening: () => void,
    setRecognition: React.Dispatch<React.SetStateAction<SpeechRecognition | null>>
) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser.');
        return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.lang = 'en-US';
    newRecognition.interimResults = false;
    newRecognition.maxAlternatives = 1;

    newRecognition.onstart = () => setIsListening(true);

    newRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const speechResult = event.results[0][0].transcript.replace(/[.,!?;:]$/, '');
        setQuery(speechResult);
    };

    newRecognition.onspeechend = stopListening;
    newRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error detected: ' + event.error);
        stopListening();
    };

    newRecognition.start();
    setRecognition(newRecognition);
}

export function stopSpeechRecognition(
    recognition: SpeechRecognition | null,
    setIsListening: React.Dispatch<React.SetStateAction<boolean>>,
    setRecognition: React.Dispatch<React.SetStateAction<SpeechRecognition | null>>
) {
    if (recognition) {
        recognition.stop();
        setRecognition(null);
    }
    setIsListening(false);
}