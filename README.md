# Quick Q&A Game - لعبة الأسئلة السريعة

A two-team quiz game in Arabic with dual-screen support (public display and moderator view).

## Features

- 🎮 Two-team competitive quiz game
- 🎯 60-second timer per question
- 📊 Real-time score tracking
- 🎨 Beautiful gradient UI with RTL support
- 📱 Dual-screen mode (Public Display & Moderator View)
- 🎬 Media support (images, videos, audio, YouTube)
- 💾 Game state persistence (localStorage)
- 🤖 ChatGPT integration for question generation
- 📝 26 predefined categories

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Game Flow

1. **Home Screen**: Enter team names and start the game
2. **Admin Interface**: Add/edit questions manually or via ChatGPT
3. **Game Screens**:
   - **Public Display**: Shows scores and current team turn
   - **Moderator Screen**: Full question view with controls (press F11/F12 to toggle)
   - **Answer Reveal**: Shows correct answer after each question
   - **Results**: Winner announcement and final scores

## Keyboard Shortcuts

- **F11 or F12**: Toggle between Public Display and Moderator View

## Question Format

Questions can be added in the following format:

```
الفئة:
السؤال؟
الجواب
https://example.com/image.jpg

سؤال آخر؟
جواب آخر
```

### Format Rules

1. **Categories**: Must end with a colon (`:`) - any text before the colon becomes the category name (freeform, no predefined list required)
   ```
   تكنلوجيا:
   برمجة:
   تاريخ العالم:
   ```

2. **Questions**: End with `?` or `؟` (Arabic question mark)

3. **Answers**: Any text following a question (until next question/category)

4. **Code Blocks**: For programming questions, use `#code#` tags:
   ```
   برمجة:
   ما هو ناتج هذه الشيفرة؟
   #code#
   x = 5
   print(x + 5)
   #/code#
   10
   ```

5. **Multiline Answers**: For answers with multiple lines, use `#multiline#` tags (optional - line breaks are preserved automatically):
   ```
   السؤال؟
   #multiline#
   السطر الأول
   السطر الثاني
   #/multiline#
   ```

6. **Media URLs**: Add image, video, audio, or YouTube URLs on separate lines after the answer:
   - Images: `.jpg`, `.png`, `.gif`, `.webp`, `.svg`
   - Videos: `.mp4`, `.webm`, `.ogg`
   - Audio: `.mp3`, `.wav`, `.ogg`, `.m4a`
   - YouTube: Any `youtube.com/watch` or `youtu.be/` link

### Complete Example

```
برمجة:
ما هو ناتج هذه الشيفرة؟
#code#
def greet():
    print("Hello")
#/code#
Hello

ماهو التكنو؟
التكنو جميل
https://example.com/image.jpg

تكنلوجيا:
سؤال آخر؟
الجواب
```

## Categories

**Freeform Categories**: You can use any category name by adding a colon (`:`) at the end. Categories are automatically created when you use them for the first time.

Example:
```
تكنلوجيا:
برمجة:
تاريخ العالم:
```

The game also includes 26 predefined categories in Arabic that you can reference:
- العلوم والاختراعات (Science & Inventions)
- جغرافيا العالم (World Geography)
- جغرافيا قطر (Qatar Geography)
- تاريخ العالم (World History)
- تاريخ قطر (Qatar History)
- الفضائ والفلك (Space & Astronomy)
- الجسم البشري والصحة (Human Body & Health)
- الرياضيات والمنطق (Mathematics & Logic)
- برمجة (Programming)
- And 18 more...

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- localStorage for persistence

## License

MIT

