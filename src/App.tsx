import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw.svg";
import { NoteCard } from "./components/NoteCard";
import { NewNoteCard } from "./components/NewNoteCard";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSeacrh] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      return JSON.parse(storedNotes);
    }
    return [];
  });

  function handleDeleteNote(id: string) {
    const noteArray = notes.filter(note => {
      return note.id !==id
    })

    setNotes(noteArray);
    localStorage.setItem('notes', JSON.stringify(noteArray));
  }

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];
    setNotes(notes);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSeacrh(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="logo do nlw notes voice" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onDeleteNote={handleDeleteNote}/>
        ))}
      </div>
    </div>
  );
}
