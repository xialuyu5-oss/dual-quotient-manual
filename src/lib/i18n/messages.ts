export type Messages = Readonly<Record<string, string>>;
export type Values = Readonly<Record<string, string | number>>;

/** Named placeholders let translations reorder whole sentences naturally. */
export function createTranslator(messages: Messages) {
  return (key: string, values: Values = {}): string => {
    const template = messages[key] ?? key;
    return template.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (token, name: string) =>
      Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token,
    );
  };
}

export type Translator = ReturnType<typeof createTranslator>;
