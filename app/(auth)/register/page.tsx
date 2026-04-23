"use client";

import Link from "next/link";
import Script from "next/script";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CreditCard,
  FileQuestion,
  IdCard,
  Loader,
  Mail,
  MapPin,
  Phone,
  Plus,
  Scissors,
  Search,
  Store,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger,
} from "@/components/stepper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthShell } from "../_components/auth-shell";
import { BrandLogo } from "../_components/brand-logo";
import { FloatingInput } from "../_components/floating-input";
import { FloatingSelect } from "../_components/floating-select";

type SubmitPhase = "idle" | "loading" | "success";
type MapsScriptState = "idle" | "ready" | "error";
type DocumentStatus = "person" | "company" | "opening" | "unknown";
type RegisterStepId = "manager" | "business" | "location" | "team";
type RegisterField =
  | "managerCpf"
  | "managerName"
  | "managerEmail"
  | "managerPhone"
  | "managerRole"
  | "businessDocumentStatus"
  | "establishmentCnpj"
  | "establishmentPublicName"
  | "businessType"
  | "teamSize"
  | "addressQuery";
type MaskType = "cpf" | "phone" | "cnpj";
type MaskedRegisterField =
  | "managerCpf"
  | "managerPhone"
  | "establishmentCnpj";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type EmployeeDraft = {
  name: string;
  email: string;
  phone: string;
};

type RegisterForm = {
  managerCpf: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerRole: string;
  businessDocumentStatus: DocumentStatus | "";
  establishmentCnpj: string;
  establishmentPublicName: string;
  businessType: string;
  teamSize: string;
  addressQuery: string;
  selectedAddress: string;
  selectedPlaceId: string;
  selectedLat: number | null;
  selectedLng: number | null;
  employees: Employee[];
};

type RegisterStepDefinition = {
  id: RegisterStepId;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: RegisterField[];
};

type RegisterStep = RegisterStepDefinition & {
  eyebrow: string;
};

type AddressSuggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

type LocationSelection = {
  address: string;
  placeId: string;
  lat: number;
  lng: number;
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: GoogleMapsApi;
  };
};

type GoogleMapCoordinates = {
  lat: number;
  lng: number;
};

type GoogleMapMouseEvent = {
  latLng?: {
    lat: () => number;
    lng: () => number;
  };
};

type GoogleAutocompletePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

type GooglePlaceDetails = {
  formatted_address?: string;
  place_id?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
};

type GoogleGeocoderResult = {
  formatted_address: string;
  place_id?: string;
};

type GoogleMapInstance = {
  panTo: (position: GoogleMapCoordinates) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number | undefined;
  addListener: (
    eventName: string,
    listener: (event: GoogleMapMouseEvent) => void,
  ) => void;
};

type GoogleMapMarker = {
  setPosition: (position: GoogleMapCoordinates) => void;
  setVisible: (visible: boolean) => void;
  addListener: (
    eventName: string,
    listener: (event: GoogleMapMouseEvent) => void,
  ) => void;
};

type GoogleAutocompleteService = {
  getPlacePredictions: (
    request: {
      input: string;
      componentRestrictions?: { country: string };
      types?: string[];
    },
    callback: (
      predictions: GoogleAutocompletePrediction[] | null,
      status: string,
    ) => void,
  ) => void;
};

type GooglePlacesService = {
  getDetails: (
    request: {
      placeId: string;
      fields: string[];
    },
    callback: (place: GooglePlaceDetails | null, status: string) => void,
  ) => void;
};

type GoogleGeocoder = {
  geocode: (
    request: { location: GoogleMapCoordinates },
    callback: (
      results: GoogleGeocoderResult[] | null,
      status: string,
    ) => void,
  ) => void;
};

type GoogleMapsApi = {
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => GoogleMapInstance;
  Marker: new (options: Record<string, unknown>) => GoogleMapMarker;
  Geocoder: new () => GoogleGeocoder;
  places: {
    AutocompleteService: new () => GoogleAutocompleteService;
    PlacesService: new (
      map: GoogleMapInstance | HTMLElement,
    ) => GooglePlacesService;
  };
};

const initialForm: RegisterForm = {
  managerCpf: "",
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  managerRole: "",
  businessDocumentStatus: "",
  establishmentCnpj: "",
  establishmentPublicName: "",
  businessType: "",
  teamSize: "",
  addressQuery: "",
  selectedAddress: "",
  selectedPlaceId: "",
  selectedLat: null,
  selectedLng: null,
  employees: [],
};

const initialEmployeeDraft: EmployeeDraft = {
  name: "",
  email: "",
  phone: "",
};

const registerStepDefinitions: Record<RegisterStepId, RegisterStepDefinition> = {
  manager: {
    id: "manager",
    title: "Cadastro do gerente",
    description:
      "Dados da pessoa responsavel pelo primeiro acesso administrativo.",
    icon: UserRound,
    fields: ["managerCpf", "managerName", "managerEmail", "managerPhone"],
  },
  business: {
    id: "business",
    title: "Dados do atendimento",
    description:
      "Informacoes para identificar como o negocio aparece para clientes e como ele funciona hoje.",
    icon: Store,
    fields: [
      "establishmentPublicName",
      "businessType",
      "teamSize",
      "businessDocumentStatus",
    ],
  },
  location: {
    id: "location",
    title: "Endereco do estabelecimento",
    description:
      "Pesquise o endereco, confira o mapa e ajuste o pin para marcar o ponto exato.",
    icon: MapPin,
    fields: ["addressQuery"],
  },
  team: {
    id: "team",
    title: "Cadastro da equipe",
    description:
      "Se quiser, adicione funcionarios agora. Voce tambem pode concluir e cadastrar depois.",
    icon: UsersRound,
    fields: [],
  },
};

const documentStatusOptions: Array<{
  value: DocumentStatus;
  title: string;
  description: string;
}> = [
  {
    value: "person",
    title: "Pessoa fisica/autonomo",
    description:
      "Usa o CPF do responsavel para liberar os primeiros agendamentos.",
  },
  {
    value: "company",
    title: "MEI ou empresa com CNPJ",
    description: "Informa o CNPJ agora para vincular o cadastro ao negocio.",
  },
  {
    value: "opening",
    title: "Estou abrindo MEI/CNPJ",
    description: "Continua com CPF e completa o CNPJ quando estiver pronto.",
  },
  {
    value: "unknown",
    title: "Ainda nao sei informar",
    description: "Continua o cadastro e revisa essa parte depois.",
  },
];

const businessTypeOptions = [
  { value: "salao-de-beleza", label: "Salao de beleza" },
  { value: "barbearia", label: "Barbearia" },
  { value: "clinica-de-estetica", label: "Clinica de estetica" },
  { value: "esmalteria", label: "Esmalteria" },
  { value: "studio-de-sobrancelhas", label: "Studio de sobrancelhas" },
  { value: "lash-designer", label: "Lash designer" },
  { value: "spa-e-bem-estar", label: "Spa e bem-estar" },
  { value: "massoterapia", label: "Massoterapia" },
  { value: "podologia", label: "Podologia" },
  { value: "outro", label: "Outro" },
];

const loadingStages = [
  {
    title: "Account Created",
    description: "Preparando a estrutura inicial do cadastro.",
  },
  {
    title: "Verifying Details",
    description: "Conferindo os dados do negocio e o endereco marcado.",
  },
  {
    title: "Welcome Aboard",
    description: "Finalizando a experiencia para a conta ficar pronta.",
  },
];

const transitionDurationMs = 180;
const defaultMapCenter = {
  lat: -23.55052,
  lng: -46.633308,
};
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const maskPatterns: Record<MaskType, string> = {
  cpf: "###.###.###-##",
  phone: "(##) #####-####",
  cnpj: "##.###.###/####-##",
};
const maskLengths: Record<MaskType, number> = {
  cpf: 11,
  phone: 11,
  cnpj: 14,
};

function buildRegisterSteps(showTeamStep: boolean) {
  const stepIds: RegisterStepId[] = [
    "manager",
    "business",
    "location",
    ...(showTeamStep ? (["team"] as RegisterStepId[]) : []),
  ];

  return stepIds.map((stepId, index) => ({
    ...registerStepDefinitions[stepId],
    eyebrow: `Etapa ${index + 1}`,
  }));
}

function isMaskedField(field: RegisterField): field is MaskedRegisterField {
  return (
    field === "managerCpf" ||
    field === "managerPhone" ||
    field === "establishmentCnpj"
  );
}

function getMaskForField(field: MaskedRegisterField): MaskType {
  switch (field) {
    case "managerCpf":
      return "cpf";
    case "managerPhone":
      return "phone";
    case "establishmentCnpj":
      return "cnpj";
  }
}

function getDigits(value: string) {
  return value.replace(/\D/g, "");
}

function sanitizeMaskedValue(mask: MaskType, value: string) {
  return getDigits(value).slice(0, maskLengths[mask]);
}

function formatMaskedValue(mask: MaskType, digits: string, showMask: boolean) {
  if (!showMask && digits.length === 0) {
    return "";
  }

  const pattern = maskPatterns[mask];
  let formatted = "";
  let digitIndex = 0;

  for (const character of pattern) {
    if (character === "#") {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex];
        digitIndex += 1;
      } else if (showMask) {
        formatted += "_";
      } else {
        break;
      }

      continue;
    }

    if (showMask || digitIndex > 0 || digits.length > 0) {
      formatted += character;
    }
  }

  return formatted;
}

function getMaskedError(mask: MaskType, value: string) {
  const digits = getDigits(value).length;

  switch (mask) {
    case "cpf":
      return digits === 11 ? "" : "Informe um CPF completo.";
    case "phone":
      return digits === 11 ? "" : "Informe um telefone com DDD completo.";
    case "cnpj":
      return digits === 14 ? "" : "Informe um CNPJ completo.";
  }
}

function sanitizeFieldValue(key: RegisterField, value: string) {
  if (key === "teamSize") {
    return getDigits(value).slice(0, 3);
  }

  if (!isMaskedField(key)) {
    return value;
  }

  return sanitizeMaskedValue(getMaskForField(key), value);
}

function getFieldDisplayValue(
  key: RegisterField,
  value: string,
  isFocused: boolean,
) {
  if (!isMaskedField(key)) {
    return value;
  }

  return formatMaskedValue(
    getMaskForField(key),
    getDigits(value),
    isFocused || value.length > 0,
  );
}

function getFieldError(key: RegisterField, value: string) {
  if (isMaskedField(key)) {
    return getMaskedError(getMaskForField(key), value);
  }

  if (key === "teamSize") {
    return Number(value) >= 1 ? "" : "Informe pelo menos 1 pessoa.";
  }

  return "";
}

function getGoogleMapsApi() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as GoogleMapsWindow).google?.maps ?? null;
}

export default function RegisterPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const employeeFormRef = useRef<HTMLFormElement>(null);
  const employeePhoneInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<GoogleMapInstance | null>(null);
  const mapMarkerRef = useRef<GoogleMapMarker | null>(null);
  const autocompleteServiceRef = useRef<GoogleAutocompleteService | null>(null);
  const placesServiceRef = useRef<GooglePlacesService | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const submitTimersRef = useRef<number[]>([]);

  const [form, setForm] = useState(initialForm);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [focusedMaskedField, setFocusedMaskedField] =
    useState<MaskedRegisterField | null>(null);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [employeeDraft, setEmployeeDraft] = useState(initialEmployeeDraft);
  const [isEmployeePhoneFocused, setIsEmployeePhoneFocused] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [loadingStep, setLoadingStep] = useState(1);
  const [mapsScriptState, setMapsScriptState] = useState<MapsScriptState>(() =>
    typeof window !== "undefined" &&
    (window as GoogleMapsWindow).google?.maps
      ? "ready"
      : "idle",
  );
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [locationError, setLocationError] = useState("");

  const showTeamStep = Number(form.teamSize) > 1;
  const registerSteps = useMemo(
    () => buildRegisterSteps(showTeamStep),
    [showTeamStep],
  );
  const currentStep = registerSteps[currentStepIndex] ?? registerSteps[0];
  const CurrentStepIcon = currentStep.icon;
  const totalSteps = registerSteps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
  const shouldAskForCnpj = form.businessDocumentStatus === "company";
  const hasGoogleMapsKey = googleMapsApiKey.length > 0;
  const isGoogleMapsReady = hasGoogleMapsKey && mapsScriptState === "ready";
  const canSearchAddressSuggestions =
    currentStep.id === "location" &&
    isGoogleMapsReady &&
    form.addressQuery.trim().length >= 3 &&
    !(form.selectedPlaceId && form.addressQuery.trim() === form.selectedAddress);
  const visibleAddressSuggestions = canSearchAddressSuggestions
    ? addressSuggestions
    : [];
  const showSearchingAddress = isSearchingAddress && canSearchAddressSuggestions;
  const mapsConfigurationMessage = !hasGoogleMapsKey
    ? "Adicione NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para liberar a busca real no Google Maps."
    : mapsScriptState === "error"
      ? "Nao foi possivel carregar o Google Maps nesta pagina."
      : "";

  const clearSubmitTimers = useCallback(() => {
    submitTimersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    submitTimersRef.current = [];
  }, []);

  const moveMarkerTo = useCallback((lat: number, lng: number) => {
    if (!googleMapRef.current || !mapMarkerRef.current) {
      return;
    }

    const position = { lat, lng };
    mapMarkerRef.current.setPosition(position);
    mapMarkerRef.current.setVisible(true);
    googleMapRef.current.panTo(position);
    googleMapRef.current.setZoom(
      Math.max(googleMapRef.current.getZoom() ?? 15, 15),
    );
  }, []);

  const applyLocationSelection = useCallback((selection: LocationSelection) => {
    moveMarkerTo(selection.lat, selection.lng);
    setAddressSuggestions([]);
    setIsSearchingAddress(false);
    setLocationError("");
    addressInputRef.current?.setCustomValidity("");

    setForm((current) => ({
      ...current,
      addressQuery: selection.address,
      selectedAddress: selection.address,
      selectedPlaceId: selection.placeId,
      selectedLat: selection.lat,
      selectedLng: selection.lng,
    }));
  }, [moveMarkerTo]);

  const handleMapLocationSelection = useCallback((lat: number, lng: number) => {
    moveMarkerTo(lat, lng);

    if (!geocoderRef.current) {
      return;
    }

    setIsResolvingAddress(true);
    geocoderRef.current.geocode(
      {
        location: { lat, lng },
      },
      (results, status) => {
        setIsResolvingAddress(false);

        if (status !== "OK" || !results?.[0]) {
          const message = "Nao foi possivel confirmar esse ponto no mapa.";
          setLocationError(message);
          setForm((current) => ({
            ...current,
            selectedAddress: "",
            selectedPlaceId: "",
            selectedLat: null,
            selectedLng: null,
          }));
          if (addressInputRef.current) {
            addressInputRef.current.setCustomValidity(message);
          }
          return;
        }

        applyLocationSelection({
          address: results[0].formatted_address,
          placeId: results[0].place_id ?? `manual-${lat}-${lng}`,
          lat,
          lng,
        });
      },
    );
  }, [applyLocationSelection, moveMarkerTo]);

  useEffect(() => {
    return () => {
      clearSubmitTimers();
    };
  }, [clearSubmitTimers]);

  useEffect(() => {
    if (!isGoogleMapsReady || !mapContainerRef.current || googleMapRef.current) {
      return;
    }

    const maps = getGoogleMapsApi();

    if (!maps) {
      return;
    }

    const map = new maps.Map(mapContainerRef.current, {
      center: defaultMapCenter,
      zoom: 11,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
    });
    const marker = new maps.Marker({
      map,
      draggable: true,
      visible: false,
    });

    marker.addListener("dragend", (event: GoogleMapMouseEvent) => {
      const lat = event.latLng?.lat?.();
      const lng = event.latLng?.lng?.();

      if (typeof lat === "number" && typeof lng === "number") {
        handleMapLocationSelection(lat, lng);
      }
    });

    map.addListener("click", (event: GoogleMapMouseEvent) => {
      const lat = event.latLng?.lat?.();
      const lng = event.latLng?.lng?.();

      if (typeof lat === "number" && typeof lng === "number") {
        handleMapLocationSelection(lat, lng);
      }
    });

    googleMapRef.current = map;
    mapMarkerRef.current = marker;
    geocoderRef.current = new maps.Geocoder();
    autocompleteServiceRef.current = new maps.places.AutocompleteService();
    placesServiceRef.current = new maps.places.PlacesService(map);
  }, [handleMapLocationSelection, isGoogleMapsReady]);

  useEffect(() => {
    if (!googleMapRef.current || !mapMarkerRef.current) {
      return;
    }

    if (form.selectedLat === null || form.selectedLng === null) {
      mapMarkerRef.current.setVisible(false);
      googleMapRef.current.panTo(defaultMapCenter);
      googleMapRef.current.setZoom(11);
      return;
    }

    moveMarkerTo(form.selectedLat, form.selectedLng);
  }, [form.selectedLat, form.selectedLng, moveMarkerTo]);

  useEffect(() => {
    if (!canSearchAddressSuggestions || !autocompleteServiceRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: form.addressQuery.trim(),
          componentRestrictions: { country: "br" },
          types: ["address"],
        },
        (predictions: GoogleAutocompletePrediction[] | null, status: string) => {
          setIsSearchingAddress(false);

          if (status !== "OK" || !predictions) {
            setAddressSuggestions([]);
            return;
          }

          setAddressSuggestions(
            predictions.map((prediction) => ({
              placeId: prediction.place_id,
              description: prediction.description,
              mainText:
                prediction.structured_formatting?.main_text ??
                prediction.description,
              secondaryText:
                prediction.structured_formatting?.secondary_text ?? "",
            })),
          );
        },
      );
    }, 260);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canSearchAddressSuggestions, form.addressQuery]);

  function updateField<Key extends RegisterField>(
    key: Key,
    value: string,
    input?: HTMLInputElement | HTMLSelectElement,
  ) {
    const nextValue = sanitizeFieldValue(key, value);

    if (input) {
      input.setCustomValidity(getFieldError(key, nextValue));
    }

    setForm((current) => ({
      ...current,
      [key]: nextValue,
    }));
  }

  function updateDocumentStatus(value: DocumentStatus) {
    setForm((current) => ({
      ...current,
      businessDocumentStatus: value,
      establishmentCnpj:
        value === "company" ? current.establishmentCnpj : "",
    }));
  }

  function getStepFields(step: RegisterStep): RegisterField[] {
    if (step.id === "business" && shouldAskForCnpj) {
      return [...step.fields, "establishmentCnpj"];
    }

    return step.fields;
  }

  function validateVisibleFields(activeFields: RegisterField[]) {
    const formElement = formRef.current;

    if (!formElement) {
      return true;
    }

    const controls = Array.from(formElement.elements).filter(
      (
        element,
      ): element is HTMLInputElement | HTMLSelectElement =>
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement,
    );
    const activeFieldSet = new Set(activeFields);
    const disabledControls: Array<HTMLInputElement | HTMLSelectElement> = [];

    controls.forEach((control) => {
      if (control.name) {
        const controlName = control.name as RegisterField;
        control.setCustomValidity(
          activeFieldSet.has(controlName)
            ? getFieldError(controlName, control.value)
            : "",
        );
      }

      if (!control.name || activeFieldSet.has(control.name as RegisterField)) {
        return;
      }

      control.disabled = true;
      disabledControls.push(control);
    });

    const isValid = formElement.reportValidity();

    disabledControls.forEach((control) => {
      control.disabled = false;
    });

    return isValid;
  }

  function validateLocationStep() {
    const isInputValid = validateVisibleFields(["addressQuery"]);
    const input = addressInputRef.current;

    if (!isInputValid || !input) {
      return false;
    }

    if (!hasGoogleMapsKey) {
      const message = "Configure a chave publica do Google Maps para continuar.";
      input.setCustomValidity(message);
      setLocationError(message);
      input.reportValidity();
      return false;
    }

    if (mapsScriptState === "error") {
      const message = "Nao foi possivel carregar o Google Maps.";
      input.setCustomValidity(message);
      setLocationError(message);
      input.reportValidity();
      return false;
    }

    if (mapsScriptState !== "ready") {
      const message = "Aguarde o mapa carregar para confirmar o endereco.";
      input.setCustomValidity(message);
      setLocationError(message);
      input.reportValidity();
      return false;
    }

    if (
      !form.selectedAddress ||
      !form.selectedPlaceId ||
      form.selectedLat === null ||
      form.selectedLng === null
    ) {
      const message =
        "Selecione um endereco da lista ou confirme o pin no mapa.";
      input.setCustomValidity(message);
      setLocationError(message);
      input.reportValidity();
      return false;
    }

    input.setCustomValidity("");
    setLocationError("");
    return true;
  }

  function validateCurrentStep() {
    switch (currentStep.id) {
      case "location":
        return validateLocationStep();
      case "team":
        return true;
      default:
        return validateVisibleFields(getStepFields(currentStep));
    }
  }

  function moveToStep(nextStepIndex: number) {
    if (
      nextStepIndex < 0 ||
      nextStepIndex >= totalSteps ||
      nextStepIndex === currentStepIndex ||
      isTransitioning
    ) {
      return;
    }

    setIsTransitioning(true);

    window.setTimeout(() => {
      setCurrentStepIndex(nextStepIndex);
      window.setTimeout(() => setIsTransitioning(false), 20);
    }, transitionDurationMs);
  }

  function startSubmitSequence() {
    clearSubmitTimers();
    setSubmitPhase("loading");
    setLoadingStep(1);

    submitTimersRef.current = [
      window.setTimeout(() => setLoadingStep(2), 900),
      window.setTimeout(() => setLoadingStep(3), 1800),
      window.setTimeout(() => {
        setLoadingStep(3);
        setSubmitPhase("success");
      }, 2800),
    ];
  }

  function handleNextStep() {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      startSubmitSequence();
      return;
    }

    moveToStep(currentStepIndex + 1);
  }

  function handlePreviousStep() {
    if (isFirstStep) {
      return;
    }

    moveToStep(currentStepIndex - 1);
  }

  function getMaskedInputProps(field: MaskedRegisterField) {
    return {
      value: getFieldDisplayValue(
        field,
        form[field],
        focusedMaskedField === field,
      ),
      onFocus: () => setFocusedMaskedField(field),
      onBlur: () =>
        setFocusedMaskedField((current) =>
          current === field ? null : current,
        ),
    };
  }

  function getEmployeePhoneDisplayValue() {
    return formatMaskedValue(
      "phone",
      employeeDraft.phone,
      isEmployeePhoneFocused || employeeDraft.phone.length > 0,
    );
  }

  function updateEmployeeDraftField(
    key: keyof EmployeeDraft,
    value: string,
    input?: HTMLInputElement,
  ) {
    const nextValue =
      key === "phone" ? sanitizeMaskedValue("phone", value) : value;

    if (input) {
      input.setCustomValidity(key === "phone" ? getMaskedError("phone", nextValue) : "");
    }

    setEmployeeDraft((current) => ({
      ...current,
      [key]: nextValue,
    }));
  }

  function validateEmployeeDraft() {
    const employeeForm = employeeFormRef.current;

    if (!employeeForm) {
      return true;
    }

    if (employeePhoneInputRef.current) {
      employeePhoneInputRef.current.setCustomValidity(
        getMaskedError("phone", employeeDraft.phone),
      );
    }

    return employeeForm.reportValidity();
  }

  function handleEmployeeDialogChange(nextOpen: boolean) {
    setIsEmployeeDialogOpen(nextOpen);

    if (!nextOpen) {
      setEmployeeDraft(initialEmployeeDraft);
      setIsEmployeePhoneFocused(false);
    }
  }

  function handleAddEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateEmployeeDraft()) {
      return;
    }

    setForm((current) => ({
      ...current,
      employees: [
        ...current.employees,
        {
          id: crypto.randomUUID(),
          name: employeeDraft.name.trim(),
          email: employeeDraft.email.trim(),
          phone: sanitizeMaskedValue("phone", employeeDraft.phone),
        },
      ],
    }));

    handleEmployeeDialogChange(false);
  }

  function removeEmployee(employeeId: string) {
    setForm((current) => ({
      ...current,
      employees: current.employees.filter(
        (employee) => employee.id !== employeeId,
      ),
    }));
  }

  function clearSelectedLocation(nextQuery: string) {
    setLocationError("");
    addressInputRef.current?.setCustomValidity("");

    if (mapMarkerRef.current) {
      mapMarkerRef.current.setVisible(false);
    }

    setForm((current) => ({
      ...current,
      addressQuery: nextQuery,
      selectedAddress: "",
      selectedPlaceId: "",
      selectedLat: null,
      selectedLng: null,
    }));
  }

  function handleAddressQueryChange(value: string, input: HTMLInputElement) {
    setIsSearchingAddress(hasGoogleMapsKey && value.trim().length >= 3);
    input.setCustomValidity("");
    clearSelectedLocation(value);
  }

  function selectAddressSuggestion(suggestion: AddressSuggestion) {
    const placesService = placesServiceRef.current;

    if (!placesService) {
      return;
    }

    setIsResolvingAddress(true);
    setIsSearchingAddress(false);

    placesService.getDetails(
      {
        placeId: suggestion.placeId,
        fields: ["formatted_address", "geometry", "place_id"],
      },
      (place: GooglePlaceDetails | null, status: string) => {
        setIsResolvingAddress(false);

        const location = place?.geometry?.location;

        if (
          status !== "OK" ||
          !location ||
          typeof location.lat !== "function" ||
          typeof location.lng !== "function"
        ) {
          const message = "Nao foi possivel carregar esse endereco.";
          setLocationError(message);
          if (addressInputRef.current) {
            addressInputRef.current.setCustomValidity(message);
          }
          return;
        }

        applyLocationSelection({
          address: place.formatted_address ?? suggestion.description,
          placeId: place.place_id ?? suggestion.placeId,
          lat: location.lat(),
          lng: location.lng(),
        });
      },
    );
  }

  function resetRegisterFlow() {
    clearSubmitTimers();
    setForm(initialForm);
    setCurrentStepIndex(0);
    setIsTransitioning(false);
    setFocusedMaskedField(null);
    setIsEmployeeDialogOpen(false);
    setEmployeeDraft(initialEmployeeDraft);
    setIsEmployeePhoneFocused(false);
    setSubmitPhase("idle");
    setLoadingStep(1);
    setAddressSuggestions([]);
    setIsSearchingAddress(false);
    setIsResolvingAddress(false);
    setLocationError("");
    addressInputRef.current?.setCustomValidity("");

    if (mapMarkerRef.current) {
      mapMarkerRef.current.setVisible(false);
    }

    if (googleMapRef.current) {
      googleMapRef.current.panTo(defaultMapCenter);
      googleMapRef.current.setZoom(11);
    }
  }

  function renderStepFields(stepId: RegisterStepId) {
    if (stepId === "manager") {
      return (
        <>
          <FloatingInput
            id="managerCpf"
            name="managerCpf"
            label="CPF do responsavel"
            type="text"
            inputMode="numeric"
            value={getMaskedInputProps("managerCpf").value}
            onChange={(event) =>
              updateField("managerCpf", event.target.value, event.currentTarget)
            }
            onFocus={getMaskedInputProps("managerCpf").onFocus}
            onBlur={getMaskedInputProps("managerCpf").onBlur}
            autoComplete="off"
            title="Informe um CPF completo."
            required
            icon={IdCard}
          />
          <FloatingInput
            id="managerName"
            name="managerName"
            label="Nome completo"
            value={form.managerName}
            onChange={(event) =>
              updateField("managerName", event.target.value, event.currentTarget)
            }
            autoComplete="name"
            required
            icon={UserRound}
          />
          <FloatingInput
            id="managerEmail"
            type="email"
            name="managerEmail"
            label="E-mail"
            value={form.managerEmail}
            onChange={(event) =>
              updateField(
                "managerEmail",
                event.target.value,
                event.currentTarget,
              )
            }
            autoComplete="email"
            required
            icon={Mail}
          />
          <FloatingInput
            id="managerPhone"
            type="text"
            name="managerPhone"
            label="Telefone ou WhatsApp"
            value={getMaskedInputProps("managerPhone").value}
            onChange={(event) =>
              updateField(
                "managerPhone",
                event.target.value,
                event.currentTarget,
              )
            }
            onFocus={getMaskedInputProps("managerPhone").onFocus}
            onBlur={getMaskedInputProps("managerPhone").onBlur}
            autoComplete="tel-national"
            inputMode="numeric"
            title="Informe um telefone com DDD."
            required
            icon={Phone}
          />
          <FloatingInput
            id="managerRole"
            name="managerRole"
            label="Cargo ou vinculo"
            value={form.managerRole}
            onChange={(event) =>
              updateField("managerRole", event.target.value, event.currentTarget)
            }
            autoComplete="organization-title"
            icon={BriefcaseBusiness}
          />
        </>
      );
    }

    if (stepId === "business") {
      return (
        <>
          <FloatingInput
            id="establishmentPublicName"
            name="establishmentPublicName"
            label="Nome que aparece para clientes"
            value={form.establishmentPublicName}
            onChange={(event) =>
              updateField(
                "establishmentPublicName",
                event.target.value,
                event.currentTarget,
              )
            }
            autoComplete="organization"
            required
            icon={Store}
          />
          <FloatingSelect
            id="businessType"
            name="businessType"
            label="Tipo de negocio"
            placeholder="Selecione o tipo de negocio"
            options={businessTypeOptions}
            value={form.businessType}
            onChange={(event) =>
              updateField(
                "businessType",
                event.target.value,
                event.currentTarget,
              )
            }
            required
            icon={Scissors}
          />
          <FloatingInput
            id="teamSize"
            name="teamSize"
            label="Tamanho da equipe"
            value={form.teamSize}
            onChange={(event) =>
              updateField("teamSize", event.target.value, event.currentTarget)
            }
            inputMode="numeric"
            title="Informe pelo menos 1 pessoa."
            autoComplete="off"
            required
            icon={UsersRound}
          />

          <fieldset className="rounded-[1.35rem] border border-[#d7c7c2] bg-white p-5 shadow-[0_14px_30px_var(--shadow-rose-light)]">
            <legend className="flex items-center gap-2 px-2 text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-text-rose-accent)]">
              <FileQuestion
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.8}
              />
              Como voce atende hoje?
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {documentStatusOptions.map((option) => {
                const isSelected = form.businessDocumentStatus === option.value;

                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-[1rem] border p-4 text-left transition duration-200 ${
                      isSelected
                        ? "border-[#8e4b63] bg-[#fff7f5] shadow-[0_12px_28px_rgba(142,75,99,0.12)]"
                        : "border-[#eadfe0] bg-white hover:border-[#c99bac] hover:bg-[#fffaf8]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessDocumentStatus"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => updateDocumentStatus(option.value)}
                      required
                      className="sr-only"
                    />
                    <span className="block text-sm font-bold text-[#403136]">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#7a686e]">
                      {option.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {shouldAskForCnpj ? (
            <FloatingInput
              id="establishmentCnpj"
              name="establishmentCnpj"
              label="CNPJ"
              type="text"
              value={getMaskedInputProps("establishmentCnpj").value}
              onChange={(event) =>
                updateField(
                  "establishmentCnpj",
                  event.target.value,
                  event.currentTarget,
                )
              }
              onFocus={getMaskedInputProps("establishmentCnpj").onFocus}
              onBlur={getMaskedInputProps("establishmentCnpj").onBlur}
              autoComplete="off"
              inputMode="numeric"
              title="Informe um CNPJ completo."
              required
              icon={CreditCard}
            />
          ) : null}
        </>
      );
    }

    if (stepId === "location") {
      return (
        <>
          <div className="relative">
            <FloatingInput
              id="addressQuery"
              name="addressQuery"
              label="Endereco completo"
              type="text"
              value={form.addressQuery}
              onChange={(event) =>
                handleAddressQueryChange(event.target.value, event.currentTarget)
              }
              autoComplete="off"
              inputRef={addressInputRef}
              required
              icon={Search}
            />

            {visibleAddressSuggestions.length > 0 ? (
              <div className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-[1.25rem] border border-[#eadfe0] bg-white shadow-[0_24px_60px_rgba(95,58,71,0.18)]">
                {visibleAddressSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.placeId}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectAddressSuggestion(suggestion)}
                    className="flex w-full items-start gap-3 border-b border-[#f2e6e5] px-4 py-3 text-left transition duration-200 last:border-b-0 hover:bg-[#fff7f5]"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73]">
                      <MapPin
                        aria-hidden="true"
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#35272c]">
                        {suggestion.mainText}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-[#7a686e]">
                        {suggestion.secondaryText || suggestion.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.6rem] border border-[#eadfe0] bg-white p-4 shadow-[0_16px_36px_rgba(188,144,139,0.08)]">
            <div className="relative overflow-hidden rounded-[1.2rem] border border-[#eadfe0] bg-[#f9f4f2]">
              <div ref={mapContainerRef} className="h-[20rem] w-full" />

              {!hasGoogleMapsKey ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,250,249,0.96)_0%,rgba(248,239,236,0.96)_100%)] px-6 text-center">
                  <div className="max-w-sm space-y-3">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#9b5d73] shadow-[0_12px_24px_rgba(155,93,115,0.14)]">
                      <MapPin
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                    <p className="text-sm font-semibold text-[#3b2a30]">
                      Google Maps ainda nao configurado
                    </p>
                    <p className="text-sm leading-6 text-[#7a686e]">
                      {mapsConfigurationMessage}
                    </p>
                  </div>
                </div>
              ) : null}

              {hasGoogleMapsKey && mapsScriptState !== "ready" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(255,250,249,0.88)] px-6 text-center backdrop-blur-sm">
                  <div className="space-y-3">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#9b5d73] shadow-[0_12px_24px_rgba(155,93,115,0.14)]">
                      <Loader
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin"
                        strokeWidth={1.8}
                      />
                    </span>
                    <p className="text-sm font-semibold text-[#3b2a30]">
                      Carregando mapa
                    </p>
                    <p className="text-sm leading-6 text-[#7a686e]">
                      O mapa e a busca de enderecos vao aparecer aqui assim que o Google terminar de carregar.
                    </p>
                  </div>
                </div>
              ) : null}

              {isResolvingAddress ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/22 backdrop-blur-[1px]">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-[#20161b]/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                    <Loader
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                      strokeWidth={1.8}
                    />
                    Confirmando esse ponto no mapa
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-[#7a686e]">
                Digite o endereco, escolha uma sugestao e ajuste o pin se precisar.
              </p>
              {showSearchingAddress ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1ec] px-3 py-1 text-xs font-semibold text-[#8f586b]">
                  <Loader
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin"
                    strokeWidth={1.8}
                  />
                  Buscando no Google
                </span>
              ) : null}
            </div>
          </div>

          {form.selectedAddress ? (
            <div className="rounded-[1.35rem] border border-[#d7c7c2] bg-white px-5 py-4 shadow-[0_14px_30px_var(--shadow-rose-light)]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ecfff4] text-[#18794c]">
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2.4}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#24181d]">
                    Local confirmado
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#7a686e]">
                    {form.selectedAddress}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#9b5d73]">
                    Lat {form.selectedLat?.toFixed(5)} | Lng {form.selectedLng?.toFixed(5)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {locationError ? (
            <p className="text-sm font-medium text-[#b04a63]">{locationError}</p>
          ) : null}
        </>
      );
    }

    return (
      <>
        <div className="rounded-[1.35rem] border border-[#d7c7c2] bg-white p-5 shadow-[0_14px_30px_var(--shadow-rose-light)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#9b5d73]">
                Equipe opcional
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[#24181d]">
                Adicione funcionarios agora ou finalize esse cadastro primeiro
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#7a686e]">
                Como voce informou {form.teamSize} pessoa(s) na equipe, esse passo fica disponivel para ja deixar os primeiros nomes cadastrados.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEmployeeDialogOpen(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_16px_30px_rgba(142,75,99,0.24)] transition duration-300 hover:-translate-y-0.5"
            >
              <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
              Adicionar funcionario
            </button>
          </div>
        </div>

        {form.employees.length > 0 ? (
          <div className="space-y-3">
            {form.employees.map((employee, index) => (
              <div
                key={employee.id}
                className="flex items-start justify-between gap-4 rounded-[1.3rem] border border-[#eadfe0] bg-white px-5 py-4 shadow-[0_14px_30px_var(--shadow-rose-light)]"
              >
                <div className="min-w-0">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#9b5d73]">
                    Funcionario {index + 1}
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#24181d]">
                    {employee.name}
                  </p>
                  <p className="mt-1 text-sm text-[#7a686e]">{employee.email}</p>
                  <p className="mt-1 text-sm text-[#7a686e]">
                    {formatMaskedValue("phone", employee.phone, false)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEmployee(employee.id)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#ead6dd] bg-[#fff8f7] text-[#8f586b] transition duration-200 hover:bg-[#fff1ee]"
                >
                  <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  <span className="sr-only">Remover funcionario</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-[#d7c7c2] bg-[rgba(255,251,250,0.84)] px-5 py-6 text-center">
            <p className="text-sm font-semibold text-[#403136]">
              Nenhum funcionario adicionado ainda
            </p>
            <p className="mt-2 text-sm leading-6 text-[#7a686e]">
              Voce pode finalizar agora e cadastrar a equipe completa depois.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-[1.35rem] border border-[#eadfe0] bg-[#fffaf8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#7a686e]">
            Esse passo e opcional. O botao principal tambem conclui o fluxo mesmo sem funcionarios adicionados.
          </p>
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#d7c0c7] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#7b5260] transition duration-200 hover:border-[#b97a8e] hover:text-[#6e4152]"
          >
            Seguir sem funcionarios
          </button>
        </div>
      </>
    );
  }

  const backButtonClassName =
    "group relative flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#d7c0c7] bg-[rgba(255,248,247,0.88)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#7b5260] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_14px_32px_rgba(180,154,164,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#b97a8e] hover:bg-[rgba(255,244,243,0.96)] hover:text-[#6e4152] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_20px_38px_rgba(170,102,126,0.18)] active:scale-[0.99]";
  const primaryButtonLabel = isLastStep ? "Enviar dados" : "Proximo";

  return (
    <>
      {hasGoogleMapsKey ? (
        <Script
          id="google-maps-script"
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&language=pt-BR&region=BR&v=weekly`}
          strategy="afterInteractive"
          onLoad={() => setMapsScriptState("ready")}
          onError={() => setMapsScriptState("error")}
        />
      ) : null}

      <AuthShell desktopClassName="max-w-[56rem]">
        <div className="rounded-[2.5rem] border border-[#efe2df] bg-white p-10 shadow-[0_25px_80px_rgba(120,77,92,0.12)] lg:p-12">
          <div className="flex flex-col items-center text-center">
            <BrandLogo maxWidthClassName="max-w-[13rem]" />
            <span className="mt-6 inline-flex rounded-full border border-[#ead7d7] bg-[#fff8f6] px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
              Cadastro inicial
            </span>
          </div>

          {submitPhase === "success" ? (
            <div className="mx-auto mt-10 max-w-[32rem] text-center">
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,#ecfff4_0%,#d8f8e7_100%)] text-[#18794c] shadow-[0_18px_36px_rgba(24,121,76,0.14)]">
                <Check
                  aria-hidden="true"
                  className="h-8 w-8"
                  strokeWidth={2.4}
                />
              </div>
              <p className="mt-8 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
                Cadastro concluido
              </p>
              <h2 className="mt-3 font-display text-[2.35rem] leading-none font-semibold text-[#24181d]">
                Tudo pronto para seguir
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#7a686e]">
                Os dados iniciais ficaram organizados no fluxo. Quando voce clicar em concluir, a tela volta limpa para o inicio do cadastro.
              </p>

              <div className="mt-8 space-y-3 rounded-[1.5rem] border border-[#eadfe0] bg-[linear-gradient(180deg,#fffdfc_0%,#fff7f5_100%)] p-6 text-left shadow-[0_16px_36px_rgba(188,144,139,0.08)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73]">
                    <UserRound
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#24181d]">
                      Responsavel
                    </p>
                    <p className="mt-1 text-sm text-[#7a686e]">
                      {form.managerName} • {form.managerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73]">
                    <Store
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#24181d]">
                      Estabelecimento
                    </p>
                    <p className="mt-1 text-sm text-[#7a686e]">
                      {form.establishmentPublicName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73]">
                    <MapPin
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#24181d]">
                      Endereco confirmado
                    </p>
                    <p className="mt-1 text-sm text-[#7a686e]">
                      {form.selectedAddress}
                    </p>
                  </div>
                </div>

                {form.employees.length > 0 ? (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73]">
                      <UsersRound
                        aria-hidden="true"
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#24181d]">
                        Equipe adicionada
                      </p>
                      <p className="mt-1 text-sm text-[#7a686e]">
                        {form.employees.length} funcionario(s) incluidos no fluxo inicial.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={resetRegisterFlow}
                className="group relative mt-8 inline-flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_38px_rgba(142,75,99,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_24px_44px_rgba(142,75,99,0.34)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70"
                />
                <span className="relative">Concluir</span>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/16 ring-1 ring-white/20">
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2.2}
                  />
                </span>
              </button>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#9b5d73]">
                  <span>
                    Etapa {currentStepIndex + 1} de {totalSteps}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-2 overflow-hidden rounded-full bg-[#f4e6e3]"
                >
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#b56b83_0%,#8e4b63_100%)] transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {registerSteps.map((step, index) => {
                    const isCurrent = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`rounded-[1rem] border px-4 py-3 text-left transition duration-300 ${
                          isCurrent
                            ? "border-[#8e4b63] bg-[#fff7f5] text-[#4a2935] shadow-[0_12px_28px_rgba(142,75,99,0.12)]"
                            : isCompleted
                              ? "border-[#decbd0] bg-[#fffaf8] text-[#6f5260]"
                              : "border-[#eadfe0] bg-white text-[#9a878d]"
                        }`}
                      >
                        <span className="block text-[0.66rem] font-bold uppercase tracking-[0.18em]">
                          {step.eyebrow}
                        </span>
                        <span className="mt-1 block text-sm font-bold">
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                ref={formRef}
                onSubmit={(event) => {
                  event.preventDefault();
                  handleNextStep();
                }}
                className="mt-8 space-y-8"
              >
                <section
                  className={`rounded-[2rem] border border-[#eadfe0] bg-[linear-gradient(180deg,#fffdfc_0%,#fff7f5_100%)] p-7 shadow-[0_16px_36px_rgba(188,144,139,0.08)] transition-all duration-300 ease-out ${
                    isTransitioning
                      ? "translate-y-3 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
                        {currentStep.eyebrow}
                      </p>
                      <h2 className="mt-2 font-display text-[2.2rem] leading-none font-semibold text-[#24181d]">
                        {currentStep.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#7a686e]">
                        {currentStep.description}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73] shadow-[0_10px_24px_rgba(155,93,115,0.16)]">
                      <CurrentStepIcon
                        aria-hidden="true"
                        className="h-6 w-6"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">{renderStepFields(currentStep.id)}</div>
                </section>

                <div className="flex items-center justify-between gap-4">
                  {isFirstStep ? (
                    <Link href="/login" className={backButtonClassName}>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90"
                      />
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#935a6f] ring-1 ring-[#ead6dd] transition duration-300 group-hover:-translate-x-0.5 group-hover:scale-105">
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 rotate-180"
                          strokeWidth={1.8}
                        />
                      </span>
                      <span className="relative">Voltar</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className={`${backButtonClassName} cursor-pointer`}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90"
                      />
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#935a6f] ring-1 ring-[#ead6dd] transition duration-300 group-hover:-translate-x-0.5 group-hover:scale-105">
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 rotate-180"
                          strokeWidth={1.8}
                        />
                      </span>
                      <span className="relative">Voltar</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="group relative flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_38px_rgba(142,75,99,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_24px_44px_rgba(142,75,99,0.34)] active:scale-[0.99]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70"
                    />
                    <span className="relative">{primaryButtonLabel}</span>
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/16 ring-1 ring-white/20 transition duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <Dialog
          open={isEmployeeDialogOpen}
          onOpenChange={handleEmployeeDialogChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar funcionario</DialogTitle>
              <DialogDescription>
                Preencha os dados basicos para incluir esse funcionario na lista do cadastro inicial.
              </DialogDescription>
            </DialogHeader>

            <form
              ref={employeeFormRef}
              onSubmit={handleAddEmployee}
              className="mt-6 space-y-4"
            >
              <FloatingInput
                id="employeeName"
                name="employeeName"
                label="Nome completo"
                value={employeeDraft.name}
                onChange={(event) =>
                  updateEmployeeDraftField(
                    "name",
                    event.target.value,
                    event.currentTarget,
                  )
                }
                autoComplete="name"
                required
                icon={UserRound}
              />
              <FloatingInput
                id="employeeEmail"
                name="employeeEmail"
                type="email"
                label="E-mail"
                value={employeeDraft.email}
                onChange={(event) =>
                  updateEmployeeDraftField(
                    "email",
                    event.target.value,
                    event.currentTarget,
                  )
                }
                autoComplete="email"
                required
                icon={Mail}
              />
              <FloatingInput
                id="employeePhone"
                name="employeePhone"
                type="text"
                label="Telefone"
                value={getEmployeePhoneDisplayValue()}
                onChange={(event) =>
                  updateEmployeeDraftField(
                    "phone",
                    event.target.value,
                    event.currentTarget,
                  )
                }
                onFocus={() => setIsEmployeePhoneFocused(true)}
                onBlur={() => setIsEmployeePhoneFocused(false)}
                autoComplete="tel-national"
                inputMode="numeric"
                inputRef={employeePhoneInputRef}
                title="Informe um telefone com DDD completo."
                required
                icon={Phone}
              />

              <DialogFooter className="pt-2">
                <button
                  type="button"
                  onClick={() => handleEmployeeDialogChange(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d7c0c7] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#7b5260] transition duration-200 hover:border-[#b97a8e] hover:text-[#6e4152]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_16px_30px_rgba(142,75,99,0.24)] transition duration-300 hover:-translate-y-0.5"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
                  Salvar funcionario
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AuthShell>

      {submitPhase === "loading" ? (
        <RegisterLoadingOverlay loadingStep={loadingStep} />
      ) : null}
    </>
  );
}

function RegisterLoadingOverlay({ loadingStep }: { loadingStep: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/84 px-6 backdrop-blur-md">
      <div className="w-full max-w-[24rem]">
        <Stepper
          value={loadingStep}
          orientation="vertical"
          indicators={{
            inactive: <span className="h-2.5 w-2.5 rounded-full bg-white/45" />,
            active: <span className="h-2.5 w-2.5 rounded-full bg-white" />,
            completed: (
              <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.4} />
            ),
            loading: (
              <Loader
                aria-hidden="true"
                className="h-3.5 w-3.5 animate-spin"
                strokeWidth={2.2}
              />
            ),
          }}
        >
          <StepperNav className="flex-col gap-3">
            {loadingStages.map((stage, index) => {
              const stepNumber = index + 1;
              const isActive = loadingStep === stepNumber;
              const isCompleted = loadingStep > stepNumber;

              return (
                <StepperItem
                  key={stage.title}
                  step={stepNumber}
                  loading={isActive}
                  completed={isCompleted}
                  className="w-full"
                >
                  <StepperTrigger asChild className="w-full">
                    <div
                      className={`w-full rounded-[1rem] border px-5 py-4 transition duration-300 ${
                        isActive
                          ? "border-white/14 bg-white/10 text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)]"
                          : isCompleted
                            ? "border-white/12 bg-white/6 text-white/88"
                            : "border-white/8 bg-white/4 text-white/45"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <StepperIndicator
                          className={`size-8 border-none ${
                            isActive
                              ? "bg-white/12 text-white"
                              : isCompleted
                                ? "bg-[#1d7d4d] text-white"
                                : "bg-white/10 text-white/60"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <StepperTitle className="text-sm font-semibold">
                            {stage.title}
                          </StepperTitle>
                          <StepperDescription
                            className={`mt-1 text-xs leading-5 ${
                              isActive || isCompleted
                                ? "text-white/72"
                                : "text-white/42"
                            }`}
                          >
                            {stage.description}
                          </StepperDescription>
                        </div>
                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/12">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isActive || isCompleted ? "bg-[#28d476]" : "bg-transparent"
                          }`}
                          style={{
                            width: isCompleted ? "100%" : isActive ? "82%" : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </StepperTrigger>
                </StepperItem>
              );
            })}
          </StepperNav>
        </Stepper>
      </div>
    </div>
  );
}
