import { useRef, useState } from "react";
import {
  Button,
  Field,
  IconButton,
  NativeSelect,
  Popover,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Settings } from "lucide-react";
import { chamberLabel, US_STATES } from "./display";
import { clearVotes, exportVotes, importVotes, setHomeState } from "./store";
import type { Chamber } from "./types";

export default function SettingsMenu({
  chamber,
  homeState,
  voteCount,
}: {
  chamber: Chamber;
  homeState: string | null;
  voteCount: number;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const count = importVotes(await file.text());
      setMessage(`Imported ${count} votes.`);
    } catch {
      setMessage("That file isn't a votes export.");
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleClear = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    clearVotes(chamber);
    setConfirmingClear(false);
    setMessage(`Cleared your ${chamberLabel(chamber)} votes.`);
  };

  return (
    <Popover.Root
      onOpenChange={() => {
        setMessage(null);
        setConfirmingClear(false);
      }}
    >
      <Popover.Trigger asChild>
        <IconButton aria-label="Settings" variant="outline" size="sm">
          <Settings size={16} />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          {/* The theme's own `bg` token stops the recipe's bg.panel from resolving */}
          <Popover.Content
            width="260px"
            css={{ "--popover-bg": "var(--chakra-colors-surface)" }}
          >
            <Popover.Body>
              <VStack align="stretch" gap={3}>
                <Field.Root>
                  <Field.Label fontSize="sm">Home state</Field.Label>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={homeState ?? ""}
                      onChange={(e) => setHomeState(e.target.value || null)}
                    >
                      <option value="">None</option>
                      {US_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                <Button size="sm" variant="outline" onClick={exportVotes}>
                  Export votes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInput.current?.click()}
                >
                  Import votes
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/json,.json"
                  aria-label="Votes file to import"
                  hidden
                  onChange={(e) => handleImport(e.target.files?.[0])}
                />
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                  disabled={voteCount === 0}
                  onClick={handleClear}
                >
                  {confirmingClear
                    ? `Really clear ${voteCount} votes?`
                    : `Clear ${chamberLabel(chamber)} votes`}
                </Button>

                {message && (
                  <Text fontSize="xs" color="textMuted">
                    {message}
                  </Text>
                )}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
