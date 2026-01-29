import type { Operation } from "../hooks/useTextEditor";
import {
  addDashAtStart,
  addDashBracketAtStart,
  addDashQuoteAtStart,
  addPlusBeforeWords,
  removeAfterSpaceDash,
  removeDuplicates,
  removeExtraSpaces,
  removePlusFromWords,
  removeSpecialChars,
  removeTabs,
  replaceSpacesWithUnderscore,
  replaceSpecialCharsWithSpace,
  sortAsc,
  sortDesc,
  toLowerCaseAll,
  toSentenceCase,
  toTitleCase,
  toUpperCaseAll,
  wrapInBrackets,
  wrapInQuotes,
} from "../utils/transformations";

export type OperationDefinition = {
  label: string;
  operationLabel: string;
  transform: Operation;
  tone?: "primary" | "neutral";
};

export type OperationGroupDefinition = {
  title: string;
  description?: string;
  actions: OperationDefinition[];
};

export const OPERATION_GROUPS: OperationGroupDefinition[] = [
  {
    title: "Зміна регістру",
    description: "Змінює регістр для кожного рядка або слова.",
    actions: [
      {
        label: "ВЕРХНІЙ РЕГІСТР",
        operationLabel: "Верхній регістр",
        transform: toUpperCaseAll,
        tone: "primary",
      },
      {
        label: "нижній регістр",
        operationLabel: "Нижній регістр",
        transform: toLowerCaseAll,
      },
      {
        label: "Кожне Слово",
        operationLabel: "Кожне слово",
        transform: toTitleCase,
      },
      {
        label: "Перше слово",
        operationLabel: "Перше слово",
        transform: toSentenceCase,
      },
    ],
  },
  {
    title: "Символи та префікси",
    description: "Обгортає або додає префікс для кожного рядка чи слова.",
    actions: [
      {
        label: "Додати + до слів",
        operationLabel: "Додати +",
        transform: addPlusBeforeWords,
      },
      {
        label: "Прибрати +",
        operationLabel: "Прибрати +",
        transform: removePlusFromWords,
      },
      {
        label: 'В лапки ""',
        operationLabel: "У лапки",
        transform: wrapInQuotes,
      },
      {
        label: "У дужки []",
        operationLabel: "У дужки",
        transform: wrapInBrackets,
      },
      {
        label: "Додати - на початок",
        operationLabel: "Додати -",
        transform: addDashAtStart,
      },
      {
        label: "Додати -[]",
        operationLabel: "Додати -[]",
        transform: addDashBracketAtStart,
      },
      {
        label: 'Додати -""',
        operationLabel: 'Додати -""',
        transform: addDashQuoteAtStart,
      },
    ],
  },
  {
    title: "Очищення",
    description: "Обрізає, видаляє або замінює типові символи.",
    actions: [
      {
        label: "Прибрати зайві пробіли",
        operationLabel: "Прибрати пробіли",
        transform: removeExtraSpaces,
      },
      {
        label: "Прибрати табуляції",
        operationLabel: "Прибрати табуляції",
        transform: removeTabs,
      },
      {
        label: 'Видалити після " -"',
        operationLabel: "Видалити після -",
        transform: removeAfterSpaceDash,
      },
      {
        label: "Пробіли -> _",
        operationLabel: "Пробіли -> _",
        transform: replaceSpacesWithUnderscore,
      },
      {
        label: "Прибрати спецсимволи",
        operationLabel: "Прибрати спецсимволи",
        transform: removeSpecialChars,
      },
      {
        label: "Спецсимволи -> пробіл",
        operationLabel: "Спецсимволи -> пробіл",
        transform: replaceSpecialCharsWithSpace,
      },
    ],
  },
  {
    title: "Сортування та унікалізація",
    description: "Упорядкуйте та очистіть список.",
    actions: [
      {
        label: "Сортувати A-Z",
        operationLabel: "Сортувати A-Z",
        transform: sortAsc,
      },
      {
        label: "Сортувати Z-A",
        operationLabel: "Сортувати Z-A",
        transform: sortDesc,
      },
      {
        label: "Прибрати дублікати",
        operationLabel: "Прибрати дублікати",
        transform: removeDuplicates,
      },
    ],
  },
];
