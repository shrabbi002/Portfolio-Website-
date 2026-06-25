'use client';
import { useState, useEffect } from 'react';

export default function Terminal({ username = 'sakhawat', hostname = 'portfolio', path = '~/about' }) {
    const [lines, setLines] = useState([
        { text: 'initializing profile environment...', type: 'system', delay: 1000 },
        { text: 'loading research models & SQA modules...', type: 'system', delay: 2000 },
        { text: 'system status: ONLINE', type: 'success', delay: 2500 }
    ]);
    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const commands = [
        { cmd: 'cat introduction.txt', output: 'SQA Engineer & Researcher focused on building reliable, data-driven, and high-quality software solutions.' },
        { cmd: 'get --expertise', output: 'Software Quality Assurance | System Analysis | Machine Learning | Data Analytics' },
        { cmd: 'run test-pipeline', output: '✔ Jest Tests: 24/24 Passed\n✔ Selenium WebDriver: 12/12 Passed\n✔ Integration Tests: SUCCESS' },
        { cmd: 'cat mission.txt', output: 'Bridging the gap between software development, strict quality standards, and advanced AI research.' }
    ];

    useEffect(() => {
        let timeoutId;
        const currentCommand = commands[currentCommandIndex];

        if (!currentCommand) return;

        // Delay before starting to type next command
        timeoutId = setTimeout(() => {
            setIsTyping(true);
            let charIndex = 0;
            setTypedText('');

            const typingInterval = setInterval(() => {
                if (charIndex < currentCommand.cmd.length) {
                    setTypedText((prev) => prev + currentCommand.cmd.charAt(charIndex));
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTyping(false);

                    // Add command and output to terminal history
                    setTimeout(() => {
                        setLines((prev) => [
                            ...prev,
                            { text: currentCommand.cmd, type: 'command' },
                            { text: currentCommand.output, type: 'output' }
                        ]);
                        
                        // Move to next command in loop
                        setTimeout(() => {
                            setCurrentCommandIndex((prev) => (prev + 1) % commands.length);
                        }, 2500); // Wait before clearing or next command
                    }, 500);
                }
            }, 60); // Speed of typing
        }, 1500); // Pause between commands

        return () => clearTimeout(timeoutId);
    }, [currentCommandIndex]);

    return (
        <div className="w-full bg-[#1e1e2e]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-primary-200">
            {/* Terminal Title Bar */}
            <div className="bg-[#181825] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-white/40 text-[10px] sm:text-xs font-semibold select-none">
                    {username}@{hostname}:{path}
                </div>
                <div className="w-14" /> {/* Spacer */}
            </div>

            {/* Terminal Body */}
            <div className="p-5 h-72 sm:h-80 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-white/5">
                {lines.map((line, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                        {line.type === 'command' && (
                            <span className="text-[#a6e3a1]">
                                {username}@{hostname}:{path}$ <span className="text-white">{line.text}</span>
                            </span>
                        )}
                        {line.type === 'output' && (
                            <div className="text-white/70 pl-4 border-l border-white/10 py-0.5">{line.text}</div>
                        )}
                        {line.type === 'system' && (
                            <span className="text-[#f9e2af] opacity-90">{line.text}</span>
                        )}
                        {line.type === 'success' && (
                            <span className="text-[#a6e3a1] font-bold">✔ {line.text}</span>
                        )}
                    </div>
                ))}

                {/* Current typing line */}
                {isTyping || currentCommandIndex !== null ? (
                    <div className="leading-relaxed">
                        <span className="text-[#a6e3a1]">
                            {username}@{hostname}:{path}$ <span className="text-white">{typedText}</span>
                            <span className="animate-pulse inline-block w-2 h-4 bg-white/80 ml-0.5 align-middle" />
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
