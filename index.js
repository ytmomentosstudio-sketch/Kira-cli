require('dotenv').config();
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const { OPENROUTER_API_KEY } = process.env;
const { models, openRouterEndpoint } = require('./config');
const { readFile, writeFile } = require('./utils');

const HISTORY_FILE = 'history.json';
let conversationHistory = [];
let currentModelName = '';
let currentModelId = '';
const commands = ['/help', '/clear', '/model', '/history'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('> '),
    completer: (line) => {
        const hits = commands.filter(c => c.startsWith(line));
        return [hits.length ? hits : commands, line];
    }
});

async function loadHistory() {
    try {
        const historyData = await readFile(HISTORY_FILE);
        conversationHistory = JSON.parse(historyData);
    } catch (error) {
        conversationHistory = [];
    }
}

async function saveHistory() {
    try {
        await writeFile(HISTORY_FILE, JSON.stringify(conversationHistory, null, 2));
    } catch (error) {}
}

function getWidth() { return process.stdout.columns || 60; }

function centerText(text, width) {
    const pad = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(pad) + text;
}

function drawWelcomeBox() {
    const w = getWidth();
    const inner = w - 2;
    const logo = [
        '██╗  ██╗██╗██████╗  █████╗ ',
        '██║ ██╔╝██║██╔══██╗██╔══██╗',
        '█████╔╝ ██║██████╔╝███████║',
        '██╔═██╗ ██║██╔══██╗██╔══██╗',
        '██║  ██╗██║██║  ██║██║  ██║',
        '╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝'
    ];
    const c = chalk.cyan;
    console.log(c('┌─ Kira CLI ' + '─'.repeat(inner - 11) + '┐'));
    console.log(c('│') + ' '.repeat(inner) + c('│'));
    for (const line of logo) {
        const centered = centerText(line, inner);
        const padded = centered + ' '.repeat(Math.max(0, inner - centered.length));
        console.log(c('│') + chalk.cyan(padded) + c('│'));
    }
    console.log(c('│') + ' '.repeat(inner) + c('│'));
    const modelLine = centerText(currentModelName || 'Select Model', inner);
    console.log(c('│') + chalk.white(modelLine + ' '.repeat(Math.max(0, inner - modelLine.length))) + c('│'));
    const pathLine = centerText('/data/data/com.termux/files/home', inner);
    console.log(c('│') + chalk.gray(pathLine + ' '.repeat(Math.max(0, inner - pathLine.length))) + c('│'));
    console.log(c('│') + ' '.repeat(inner) + c('│'));
    console.log(c('└' + '─'.repeat(inner) + '┘'));
}

function showHelp() {
    console.log('\n' + chalk.cyan('┌─ KIRA COMMANDS ──────────────────┐'));
    console.log(chalk.cyan('│') + chalk.yellow(' /help   ') + chalk.white('- Sare commands dekho     ') + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.yellow(' /clear  ') + chalk.white('- Screen saaf karo        ') + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.yellow(' /model  ') + chalk.white('- Model switch karo       ') + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.yellow(' /history') + chalk.white('- Purani baatein dekho    ') + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.yellow(' exit    ') + chalk.white('- Kira band karo          ') + chalk.cyan('│'));
    console.log(chalk.cyan('└──────────────────────────────────┘') + '\n');
}

function showCommandSuggestions(partial) {
    const hits = commands.filter(c => c.startsWith(partial));
    if (hits.length > 0) {
        console.log(chalk.gray('\nCommands:'));
        hits.forEach(cmd => console.log(chalk.cyan('  ' + cmd)));
        console.log('');
    }
}

function renderStatusBar() {
    const w = getWidth();
    console.log('\n' + chalk.gray('─'.repeat(w)));
    console.log(chalk.blue('● ' + currentModelName) + '  ' + chalk.gray('● Hist: ' + conversationHistory.length) + '  ' + chalk.yellow('● /help'));
    console.log('');
}

async function typeText(text) {
    process.stdout.write(chalk.green('✦ '));
    const words = text.split(' ');
    for (const word of words) {
        process.stdout.write(chalk.white(word + ' '));
        await new Promise(resolve => setTimeout(resolve, 15));
    }
    process.stdout.write('\n');
}

async function getAIResponse(messages, model) {
    try {
        const response = await axios.post(openRouterEndpoint, {
            model: model,
            messages: messages,
            stream: false,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        return `Error: ${error.response ? error.response.status : error.message}`;
    }
}

async function selectModel() {
    const modelNames = Object.keys(models);
    console.log('');
    modelNames.forEach((m, i) => {
        console.log(chalk.gray(`  [${i+1}] ${m}`));
    });
    console.log('');
    return new Promise((resolve) => {
        rl.question(chalk.cyan('Model chunein > '), (answer) => {
            const index = parseInt(answer) - 1;
            if (index >= 0 && index < modelNames.length) {
                resolve(modelNames[index]);
            } else {
                console.log(chalk.red('Galat choice! Dobara try karo.'));
                selectModel().then(resolve);
            }
        });
    });
}

async function main() {
    await loadHistory();
    console.clear();
    drawWelcomeBox();
    currentModelName = await selectModel();
    currentModelId = models[currentModelName];
    console.clear();
    drawWelcomeBox();
    console.log(chalk.gray('\n/help type karo commands dekhne ke liye\n'));

    const askQuestion = () => {
        renderStatusBar();
        rl.prompt();
    };

    askQuestion();

    rl.on('line', async (line) => {
        const userInput = line.trim();
        if (!userInput) { askQuestion(); return; }

        // Show suggestions if only / typed
        if (userInput === '/') {
            showCommandSuggestions('/');
            askQuestion();
            return;
        }

        // Show suggestions for partial commands
        if (userInput.startsWith('/') && userInput.length < 8 && !commands.includes(userInput)) {
            showCommandSuggestions(userInput);
            askQuestion();
            return;
        }

        if (userInput === '/help') {
            showHelp();
            askQuestion();
            return;
        }

        if (userInput === '/clear') {
            console.clear();
            drawWelcomeBox();
            askQuestion();
            return;
        }

        if (userInput === '/model') {
            console.log(chalk.cyan('\nModel switch karo:'));
            currentModelName = await selectModel();
            currentModelId = models[currentModelName];
            console.log(chalk.green(`✔ Model changed to: ${currentModelName}\n`));
            askQuestion();
            return;
        }

        if (userInput === '/history') {
            console.log(chalk.cyan('\n── Chat History ──'));
            if (conversationHistory.length === 0) {
                console.log(chalk.gray('Koi history nahi hai abhi!\n'));
            } else {
                conversationHistory.slice(-6).forEach(msg => {
                    const prefix = msg.role === 'user' ? chalk.magenta('You: ') : chalk.green('AI:  ');
                    console.log(prefix + chalk.white(msg.content.substring(0, 80) + '...'));
                });
            }
            console.log('');
            askQuestion();
            return;
        }

        if (userInput.toLowerCase() === 'exit') {
            await saveHistory();
            console.log(chalk.cyan('\nAlvida! Phir milenge. 👋'));
            process.exit(0);
        }

        console.log(`\n${chalk.magenta('You:')} ${userInput}`);
        conversationHistory.push({ role: 'user', content: userInput });
        process.stdout.write(chalk.cyan('Kira soch rahi hai...'));
        const aiResponse = await getAIResponse(conversationHistory, currentModelId);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        await typeText(aiResponse);
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        await saveHistory();
        askQuestion();
    });
}

main();
