import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"

interface NoteCardProps {
  onNoteCreated: (content: string) => void
}

let recognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState("")

  function handleStartEditor() {
    setShouldShowOnBoarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === "") {
      setShouldShowOnBoarding(true)
    }
  }

  function handelSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === ""){
      return;
    }

    onNoteCreated(content)

    setContent("")
    setShouldShowOnBoarding(true)
    toast.success("Nota criada com sucesso!")
  }

  function handleStartRecording() {
    const isSpeechRecognitionAvailable = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if(!isSpeechRecognitionAvailable){
      alert("Seu navegador não suporta o reconhecimento de fala");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'
    recognition.continuous= true
    recognition.maxAlternatives = 1
    recognition.interimResults = true

    recognition.onresult = (event) => {
      const transcription =Array.from(event.results).reduce((text, results)=>{
        return text.concat(results[0].transcript)
      }, '')

      setContent(transcription);
    }

    recognition.onerror= (event) => {
      console.error(event);
    }

    recognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (recognition !== null) {
      recognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-slate-600 p-5 rounded-md flex flex-col gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="font-medium text-sm leading-5 text-slate-200">
          Adicionar nota
        </span>
        <p className="font-normal text-slate-400 leading-6 text-left">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 bg-black/50 fixed" />
        <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="font-medium text-sm leading-5 text-slate-300">
                {" "}
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p className="font-normal text-slate-400 leading-6">
                  Comece{" "}
                  <button
                    type="submit"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecording}
                  >
                    gravando uma nota em áudio
                  </button>{" "}
                  ou se preferir{" "}
                  <button
                    type="submit"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              >
                <div className="size-3 rounded-full border-l-red-500 animate-pulse"/>
                Gravando! (click para interronper)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                onClick={handelSaveNote}
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
