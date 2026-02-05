import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateFlowScreen from "../../screens/CreateFlowScreen";

// 1. On mock les dépendances externes
// On a besoin de simuler Redux car CreateFlowScreen utilise useDispatch et useSelector
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// On mock l'action Redux. Pas besoin qu'elle fasse grand chose, juste qu'elle existe.
jest.mock("../../redux/slices/taskSlices", () => ({
  createTask: jest.fn(() => ({ type: "task/create" })),
}));

// On mock les icônes pour éviter les warnings de rendu
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("<CreateFlowScreen />", () => {
  // Variables partagées pour les tests
  let mockDispatch;
  let mockNavigation;
  let useSelectorMock;
  let useDispatchMock;

  beforeEach(() => {
    // Reset des mocks avant chaque test pour éviter les effets de bord
    useDispatchMock = require("react-redux").useDispatch;
    useSelectorMock = require("react-redux").useSelector;

    // Simulation de la fonction dispatch
    // TRICK SENIOR : Ton code utilise .unwrap(). Le dispatch doit donc retourner un objet avec unwrap.
    mockDispatch = jest.fn(() => ({
      unwrap: jest.fn(() => Promise.resolve()), // Par défaut, ça réussit
    }));
    useDispatchMock.mockReturnValue(mockDispatch);

    // Par défaut, le state loading est false et pas d'erreur
    useSelectorMock.mockReturnValue({ loading: false, error: null });

    // Mock de la navigation
    mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- TEST 1 : RENDU INITIAL ---
  it("renders correctly initial elements", () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateFlowScreen navigation={mockNavigation} />
    );

    expect(getByText("Nouvelle Excuse")).toBeTruthy();
    expect(
      getByPlaceholderText("Ex: Finir le rapport trimestriel...")
    ).toBeTruthy();
    expect(getByText("Valider")).toBeTruthy();
  });

  // --- TEST 2 : VALIDATION (Sad Path) ---
  it("shows validation errors if inputs are empty or too short", async () => {
    const { getByText, getByTestId } = render(
      <CreateFlowScreen navigation={mockNavigation} />
    );

    // On clique direct sur valider sans rien remplir
    fireEvent.press(getByText("Valider"));

    // On s'attend à voir les messages d'erreur
    await waitFor(() => {
      expect(
        getByText("La tâche doit faire au moins 10 caractères.")
      ).toBeTruthy();
      expect(
        getByText("L'excuse doit faire au moins 5 caractères.")
      ).toBeTruthy();
    });

    // On vérifie que dispatch n'a PAS été appelé (on ne spamme pas l'API si c'est invalide)
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  // --- TEST 3 : SOUMISSION CHALLENGE (Happy Path) ---
  it("dispatches createTask and goes back on success (Challenge Mode)", async () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateFlowScreen navigation={mockNavigation} />
    );

    // Remplir les champs correctement
    fireEvent.changeText(
      getByPlaceholderText("Ex: Finir le rapport trimestriel..."),
      "Faire ma comptabilité en retard"
    );
    fireEvent.changeText(
      getByPlaceholderText("Ex: J'ai poney aquatique..."),
      "J'ai la flemme et il fait beau"
    );

    // S'assurer qu'on est en mode Challenge (par défaut normalement)
    fireEvent.press(getByText("Challenge"));

    // Soumettre
    fireEvent.press(getByText("Valider"));

    // Vérifications
    await waitFor(() => {
      // 1. Redux dispatch appelé avec les bonnes données ?
      expect(mockDispatch).toHaveBeenCalled();
      // 2. Navigation : en mode Challenge, on veut goBack() pour revenir au feed
      expect(mockNavigation.goBack).toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  // --- TEST 4 : SOUMISSION ROASTY (Happy Path) ---
  it("navigates to RoastModal on success (Roasty Mode)", async () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateFlowScreen navigation={mockNavigation} />
    );

    // Remplir
    fireEvent.changeText(
      getByPlaceholderText("Ex: Finir le rapport trimestriel..."),
      "Nettoyer mon appartement sale"
    );
    fireEvent.changeText(
      getByPlaceholderText("Ex: J'ai poney aquatique..."),
      "C'est le week-end, je veux dormir"
    );

    // Changer le mode pour Roasty
    fireEvent.press(getByText("Roasty"));

    // Soumettre
    fireEvent.press(getByText("Valider"));

    await waitFor(() => {
      // Vérifier que le dispatch a bien reçu le type 'roasty' (tu devras peut-être inspecter les args du dispatch plus finement si besoin)
      expect(mockDispatch).toHaveBeenCalled();

      // Navigation : en mode Roasty, on ouvre la modale
      expect(mockNavigation.navigate).toHaveBeenCalledWith("RoastModal");
    });
  });

  // --- TEST 5 : GESTION D'ERREUR API ---
  it("displays API error if submission fails", async () => {
    // Simulation : l'API renvoie une erreur via le Selector
    useSelectorMock.mockReturnValue({
      loading: false,
      error: "Serveur en feu 🔥",
    });

    // Simulation : le dispatch fail (promise rejected)
    mockDispatch.mockReturnValue({
      unwrap: jest.fn(() => Promise.reject("Erreur API")),
    });

    const { getByText, getByPlaceholderText } = render(
      <CreateFlowScreen navigation={mockNavigation} />
    );

    // Remplir valide
    fireEvent.changeText(
      getByPlaceholderText("Ex: Finir le rapport trimestriel..."),
      "Tâche très importante à faire"
    );
    fireEvent.changeText(
      getByPlaceholderText("Ex: J'ai poney aquatique..."),
      "Excuse bidon pour tester"
    );

    fireEvent.press(getByText("Valider"));

    // On vérifie que l'erreur s'affiche (elle vient du useSelector dans ton code)
    expect(getByText("Serveur en feu 🔥")).toBeTruthy();

    // On vérifie qu'on n'a PAS navigué
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
