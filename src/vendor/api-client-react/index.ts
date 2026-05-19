/**
 * Stand-in for the monorepo `@workspace/api-client-react` package.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type TokenGetter = () => string | null;
let authTokenGetter: TokenGetter = () => null;

export function setAuthTokenGetter(getter: TokenGetter) {
  authTokenGetter = getter;
}

export function getGetProductsQueryKey() {
  return ["stub", "products"] as const;
}

export function getGetOrdersQueryKey(params?: Record<string, string>) {
  if (!params || Object.keys(params).length === 0) return ["stub", "orders"] as const;
  return ["stub", "orders", params] as const;
}

type ProductRow = {
  id: number;
  name: string;
  category?: string;
  description?: string;
  price: number;
  stock?: number;
  reference: string;
  status: "active" | "archived";
  variants?: string;
};

let mockProducts: ProductRow[] = [
  { id: 1, name: "Casque Bluetooth Pro", category: "Audio", description: "Réduction de bruit, autonomie 24h.", price: 12900, stock: 12, reference: "REF-1001", status: "active" },
  { id: 2, name: "Chargeur USB-C 65W", category: "Accessoires", price: 4500, stock: 40, reference: "REF-2002", status: "active" },
];

let nextProductId = 100;

type RecentInsightTag = "safe_pay" | "call_required" | "new_customer" | "loyal" | "high_risk";

type OrderRow = {
  id: number;
  trackingCode: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  wilaya: string;
  commune: string;
  totalPrice: number;
  safePayStatus: "paid" | "pending" | "deducted";
  status: "confirmation" | "preparation" | "dispatch" | "en_livraison" | "livre" | "retour";
  createdAt: string;
  product?: { name: string };
  shopName: string;
  /** Hint for « Commandes récentes » (point + pastille) */
  insightTag?: RecentInsightTag;
};

let mockOrders: OrderRow[] = [
  { id: 501, trackingCode: "SO-DEMO-001", clientFirstName: "Samir", clientLastName: "K.", clientPhone: "0555123456", wilaya: "Alger", commune: "Hydra", totalPrice: 12900, safePayStatus: "pending", status: "preparation", createdAt: new Date().toISOString(), product: { name: "Casque Bluetooth Pro" }, shopName: "Boutique Yacine", insightTag: "call_required" },
  { id: 502, trackingCode: "SO-DEMO-002", clientFirstName: "Lina", clientLastName: "M.", clientPhone: "0661987654", wilaya: "Oran", commune: "Es Senia", totalPrice: 4500, safePayStatus: "paid", status: "livre", createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), product: { name: "Chargeur USB-C 65W" }, shopName: "Boutique Yacine", insightTag: "safe_pay" },
  { id: 503, trackingCode: "SO-DEMO-003", clientFirstName: "Karim", clientLastName: "B.", clientPhone: "0770123456", wilaya: "Constantine", commune: "El Khroub", totalPrice: 12900, safePayStatus: "paid", status: "livre", createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), product: { name: "Casque Bluetooth Pro" }, shopName: "Boutique Yacine", insightTag: "new_customer" },
  { id: 504, trackingCode: "SO-DEMO-004", clientFirstName: "Samir", clientLastName: "K.", clientPhone: "0555123456", wilaya: "Alger", commune: "Bab Ezzouar", totalPrice: 4500, safePayStatus: "pending", status: "dispatch", createdAt: new Date(Date.now() - 86400000).toISOString(), product: { name: "Chargeur USB-C 65W" }, shopName: "Tech Store Alger", insightTag: "loyal" },
  /** Démo dashboard client — connexion avec 0555555555 ou 055555555 + OTP */
  { id: 505, trackingCode: "SO-MOCK-555-01", clientFirstName: "Amel", clientLastName: "R.", clientPhone: "0555555555", wilaya: "Blida", commune: "Blida", totalPrice: 8900, safePayStatus: "paid", status: "livre", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), product: { name: "Écouteurs sans fil TWS" }, shopName: "Boutique Yacine", insightTag: "high_risk" },
  { id: 506, trackingCode: "SO-MOCK-555-02", clientFirstName: "Amel", clientLastName: "R.", clientPhone: "0555555555", wilaya: "Tipaza", commune: "Koléa", totalPrice: 3200, safePayStatus: "pending", status: "en_livraison", createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), product: { name: "Coque smartphone transparente" }, shopName: "Tech Store Alger", insightTag: "safe_pay" },
  { id: 507, trackingCode: "SO-MOCK-555-03", clientFirstName: "Amel", clientLastName: "R.", clientPhone: "0555555555", wilaya: "Alger", commune: "Dar El Beïda", totalPrice: 15600, safePayStatus: "pending", status: "preparation", createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), product: { name: "Montre connectée Sport" }, shopName: "Mode & Tech Oran", insightTag: "new_customer" },
];

let mockMerchant = {
  id: 1,
  shopName: "Boutique Yacine",
  phone1: "0550 000 000",
  phone2: "0770 000 000",
  wilaya: "Alger",
  address: "Rue, Cité, N° 12 — Bab Ezzouar",
  status: "active" as const,
  trustScore: 87,
  merchantCode: "MRCH-DEMO-01",
  email: "yacine@boutique.dz",
};

export function useGetProducts() {
  return useQuery({
    queryKey: getGetProductsQueryKey(),
    queryFn: async () => [...mockProducts],
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const id = nextProductId++;
      const row: ProductRow = {
        id,
        name: String(data.name ?? "Produit"),
        category: data.category ? String(data.category) : undefined,
        description: data.description ? String(data.description) : undefined,
        price: Number(data.price ?? 0),
        stock: data.stock != null ? Number(data.stock) : undefined,
        reference: `REF-${id}`,
        status: "active",
        variants: data.variants ? String(data.variants) : undefined,
      };
      mockProducts = [...mockProducts, row];
      return row;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: getGetProductsQueryKey() }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
      mockProducts = mockProducts.map((p) =>
        p.id === id
          ? {
              ...p,
              name: data.name != null ? String(data.name) : p.name,
              category: data.category != null ? String(data.category) : p.category,
              description: data.description != null ? String(data.description) : p.description,
              price: data.price != null ? Number(data.price) : p.price,
              stock: data.stock != null ? Number(data.stock) : p.stock,
              variants: data.variants != null ? String(data.variants) : p.variants,
            }
          : p,
      );
      return mockProducts.find((p) => p.id === id);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: getGetProductsQueryKey() }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      mockProducts = mockProducts.map((p) => (p.id === id ? { ...p, status: "archived" as const } : p));
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: getGetProductsQueryKey() }),
  });
}

export function useGetOrders(params: Record<string, string> = {}, _opts?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery({
    queryKey: getGetOrdersQueryKey(params),
    queryFn: async () => {
      let list = [...mockOrders];
      const st = params.status;
      if (st && st !== "all") list = list.filter((o) => o.status === st);
      return list;
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { status: OrderRow["status"] } }) => {
      mockOrders = mockOrders.map((o) => (o.id === id ? { ...o, status: data.status } : o));
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["stub", "orders"] });
      void qc.invalidateQueries({ queryKey: ["stub", "recent-orders"] });
      void qc.invalidateQueries({ queryKey: ["stub", "dashboard-pipeline"] });
    },
  });
}

export function useGetProductOrderLink(productId: number) {
  return useQuery({
    queryKey: ["stub", "product-order", productId],
    enabled: Number.isFinite(productId) && productId > 0,
    queryFn: async () => {
      const p = mockProducts.find((x) => x.id === productId && x.status === "active");
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price,
        shopName: mockMerchant.shopName,
        trustScore: mockMerchant.trustScore,
        deliveryCompanies: [] as string[],
      };
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: {
        productId: number;
        clientFirstName: string;
        clientLastName: string;
        clientPhone: string;
        wilaya: string;
        commune: string;
        address: string;
        deliveryCompany: string;
        receptionMode: string;
        remark?: string;
        paymentMethod: string;
      };
    }) => {
      const id = 9000 + Math.floor(Math.random() * 1000);
      const trackingCode = `SO-${Date.now().toString(36).toUpperCase()}`;
      mockOrders = [
        {
          id,
          trackingCode,
          clientFirstName: String(data.clientFirstName ?? ""),
          clientLastName: String(data.clientLastName ?? ""),
          clientPhone: String(data.clientPhone ?? ""),
          wilaya: String(data.wilaya ?? ""),
          commune: String(data.commune ?? ""),
          totalPrice: Number(mockProducts.find((x) => x.id === data.productId)?.price ?? 0),
          safePayStatus: "pending",
          status: "confirmation",
          createdAt: new Date().toISOString(),
          product: { name: String(mockProducts.find((x) => x.id === data.productId)?.name ?? "Produit") },
          shopName: mockMerchant.shopName,
        },
        ...mockOrders,
      ];
      return { trackingCode };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
      void qc.invalidateQueries({ queryKey: ["stub", "recent-orders"] });
      void qc.invalidateQueries({ queryKey: ["stub", "dashboard-pipeline"] });
    },
  });
}

export function useTrackOrder(code: string) {
  return useQuery({
    queryKey: ["stub", "track", code],
    enabled: code.trim().length > 0,
    queryFn: async () => {
      const order = mockOrders.find((o) => o.trackingCode === code);
      if (!order) return null;
      const steps = [
        { label: "Commande confirmée", done: true, timestamp: order.createdAt },
        { label: "Préparation", done: order.status !== "confirmation", timestamp: null as string | null },
        { label: "Expédition", done: ["dispatch", "en_livraison", "livre"].includes(order.status), timestamp: null },
        { label: "En livraison", done: ["en_livraison", "livre"].includes(order.status), timestamp: null },
        { label: "Livré", done: order.status === "livre", timestamp: order.status === "livre" ? order.createdAt : null },
      ];
      const est = new Date();
      est.setDate(est.getDate() + 3);
      return {
        order: {
          id: order.id,
          trackingCode: order.trackingCode,
          status: order.status,
          wilaya: order.wilaya,
          commune: order.commune,
          clientPhone: order.clientPhone,
          product: order.product,
        },
        steps,
        estimatedDelivery: est.toISOString(),
      };
    },
  });
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["stub", "dashboard-stats"],
    queryFn: async () => ({
      ordersToday: 24,
      ordersTodayDelta: 3,
      inDeliveryCount: 7,
      urgentInDelivery: 2,
      returnsCount: 3,
      trustScore: mockMerchant.trustScore,
      trustScoreDeltaMonth: 2,
      revenueMonth: 245000,
      deliveryRate: 96,
    }),
  });
}

export function useGetDashboardPipeline() {
  return useQuery({
    queryKey: ["stub", "dashboard-pipeline"],
    queryFn: async () => {
      const counts: Record<string, number> = {
        confirmation: 0,
        preparation: 0,
        dispatch: 0,
        en_livraison: 0,
        livre: 0,
        retour: 0,
      };
      for (const o of mockOrders) counts[o.status] = (counts[o.status] ?? 0) + 1;
      return counts;
    },
  });
}

export function useGetRecentOrders() {
  return useQuery({
    queryKey: ["stub", "recent-orders"],
    queryFn: async () =>
      [...mockOrders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((o) => ({
          id: o.id,
          clientFirstName: o.clientFirstName,
          clientLastName: o.clientLastName,
          wilaya: o.wilaya,
          totalPrice: o.totalPrice,
          insightTag: o.insightTag ?? "new_customer",
        })),
  });
}

export function useGetPerformanceStats(_args?: { period?: string }) {
  return useQuery({
    queryKey: ["stub", "performance-stats", _args?.period ?? "30d"],
    queryFn: async () => ({
      confirmationRate: 88,
      deliveryRate: 96,
      returnRate: 4,
      weeklyOrders: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => ({
        day,
        revenue: 12000 + i * 1800,
        orders: 3 + i,
      })),
      deliveryRateByCompany: [
        { company: "Yalidine", rate: 97, total: 120 },
        { company: "Zaki", rate: 94, total: 45 },
      ],
      topProducts: [
        { name: "Casque Bluetooth Pro", sales: 42, revenue: 541800 },
        { name: "Chargeur USB-C 65W", sales: 38, revenue: 171000 },
      ],
      feedbackSentiment: {
        positivePct: 94,
        negativePct: 6,
        negativeMotifs: [
          { id: "delivery" as const, count: 4 },
          { id: "color" as const, count: 2 },
        ],
      },
    }),
  });
}

export function useGetInsights() {
  return useQuery({
    queryKey: ["stub", "insights"],
    queryFn: async () => ({
      improvements: [
        { priority: "high" as const, text: "Réduire le délai moyen en phase « préparation »." },
        { priority: "medium" as const, text: "Ajouter plus de preuves de livraison pour le Trust Score." },
      ],
      strengths: [
        { text: "Taux de livraison au-dessus de la moyenne marché." },
        { text: "Peu de retours sur les commandes Cash on Delivery." },
      ],
      returnAnalysis: [
        {
          trackingCode: "SO-DEMO-RET",
          cause: "Colis endommagé",
          aiSuggestion: "Renforcer l'emballage pour les produits fragiles.",
        },
      ],
    }),
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["stub", "merchant", "me"],
    queryFn: async () => ({ ...mockMerchant }),
  });
}

export function useUpdateMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
      if (mockMerchant.id !== id) return mockMerchant;
      mockMerchant = {
        ...mockMerchant,
        shopName: data.shopName != null ? String(data.shopName) : mockMerchant.shopName,
        phone1: data.phone1 != null ? String(data.phone1) : mockMerchant.phone1,
        phone2: data.phone2 != null ? String(data.phone2) : mockMerchant.phone2,
        wilaya: data.wilaya != null ? String(data.wilaya) : mockMerchant.wilaya,
        address: data.address != null ? String(data.address) : mockMerchant.address,
      };
      return mockMerchant;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["stub", "merchant", "me"] }),
  });
}

export function useLoginMerchant() {
  return useMutation({
    mutationFn: async ({ data }: { data: { email: string; password: string } }) => ({
      token: `stub-merchant-${data.email}`,
    }),
  });
}

export function useRegisterMerchant() {
  return useMutation({
    mutationFn: async ({ data: _data }: { data: Record<string, unknown> }) => ({
      token: "stub-merchant-register",
    }),
  });
}

export function useSendClientOtp() {
  return useMutation({
    mutationFn: async ({ data }: { data: { phone: string } }) => {
      const digits = data.phone.replace(/\D/g, "");
      if (digits.length < 9) throw new Error("invalid");
      return { ok: true as const, demoOtp: "123456" };
    },
  });
}

const STUB_CLIENT_OTP = "123456";

export function useLoginClient() {
  return useMutation({
    mutationFn: async ({ data }: { data: { phone: string; otp: string } }) => {
      const digits = data.phone.replace(/\D/g, "");
      const otp = data.otp.replace(/\s/g, "");
      if (digits.length < 9) throw new Error("invalid phone");
      if (!/^\d{6}$/.test(otp)) throw new Error("invalid otp");
      if (otp !== STUB_CLIENT_OTP) throw new Error("invalid otp");
      return { token: `stub-client-tel-${digits}` };
    },
  });
}

export function useRegisterClient() {
  return useMutation({
    mutationFn: async ({ data: _data }: { data: Record<string, unknown> }) => ({
      token: `stub-client-${String(_data.email ?? "client@demo.dz")}`,
    }),
  });
}

const STUB_CLIENT_PROFILE_KEY = "safeorder_client_profile";

type StubStoredClientProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilaya?: string;
  createdAt: string;
};

function readStubClientProfile(): StubStoredClientProfile | null {
  try {
    const raw = localStorage.getItem(STUB_CLIENT_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StubStoredClientProfile;
  } catch {
    return null;
  }
}

function parseEmailFromStubClientToken(token: string): string | null {
  const prefix = "stub-client-";
  if (!token.startsWith(prefix) || token.startsWith("stub-client-tel-")) return null;
  const rest = token.slice(prefix.length);
  return rest.includes("@") ? rest : null;
}

function parsePhoneDigitsFromStubClientToken(token: string | null): string | null {
  const prefix = "stub-client-tel-";
  if (!token?.startsWith(prefix)) return null;
  const digits = token.slice(prefix.length).replace(/\D/g, "");
  return digits.length >= 9 ? digits : null;
}

function formatPhoneFr(digits: string): string {
  if (digits.length <= 4) return digits;
  const parts: string[] = [];
  let i = 0;
  if (digits.startsWith("0")) {
    parts.push(digits.slice(0, 4));
    i = 4;
  } else {
    parts.push(digits.slice(0, 2));
    i = 2;
  }
  while (i < digits.length) {
    parts.push(digits.slice(i, i + 2));
    i += 2;
  }
  return parts.join(" ");
}

export function useGetClientMe() {
  return useQuery({
    queryKey: ["stub", "client", "me"],
    queryFn: async () => {
      const token = authTokenGetter();
      const phoneDigits = token ? parsePhoneDigitsFromStubClientToken(token) : null;
      if (phoneDigits) {
        return {
          firstName: "Client",
          lastName: "",
          email: "—",
          phone: formatPhoneFr(phoneDigits),
          phoneDigits,
          wilaya: undefined as string | undefined,
          createdAt: new Date().toISOString(),
        };
      }
      const profile = readStubClientProfile();
      if (profile) {
        return {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone?.trim() ? profile.phone : "—",
          phoneDigits: profile.phone?.replace(/\D/g, "") ?? "",
          wilaya: profile.wilaya,
          createdAt: profile.createdAt,
        };
      }
      const email = token ? parseEmailFromStubClientToken(token) : null;
      if (email) {
        const local = email.split("@")[0] ?? "Client";
        const display = local
          .replace(/[._-]+/g, " ")
          .trim()
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        return {
          firstName: display || "Client",
          lastName: "",
          email,
          phone: "—",
          phoneDigits: "",
          wilaya: undefined as string | undefined,
          createdAt: new Date().toISOString(),
        };
      }
      return {
        firstName: "Client",
        lastName: "Demo",
        email: "client@demo.dz",
        phone: "0555112233",
        phoneDigits: "0555112233",
        wilaya: "Alger",
        createdAt: new Date().toISOString(),
      };
    },
  });
}

export function useGetClientOrders(phone: string) {
  return useQuery({
    queryKey: ["stub", "client-orders", phone],
    enabled: phone.trim().length >= 9,
    queryFn: async () => {
      const digits = phone.replace(/\D/g, "");
      /** Saisie « 055555555 » (9 chiffres) → même jeu de données que 0555555555 */
      const normalized = digits === "055555555" ? "0555555555" : digits;
      return mockOrders.filter((o) => o.clientPhone.replace(/\D/g, "") === normalized);
    },
  });
}

type StubFeedbackEntry = { rating: number; comment?: string; submittedAt: string };

const feedbackByOrder = new Map<number, StubFeedbackEntry>();

feedbackByOrder.set(502, {
  rating: 5,
  comment: "Livraison rapide, produit conforme à la description. Je recommande la boutique !",
  submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
});
feedbackByOrder.set(503, {
  rating: 4,
  comment: "Très bon casque, emballage soigné. Un petit délai sur l'expédition mais rien de grave.",
  submittedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
});
feedbackByOrder.set(505, {
  rating: 5,
  comment: "Livraison nickel, produit conforme.",
  submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
});

export type MerchantFeedbackReceivedItem = {
  orderId: number;
  trackingCode: string;
  clientDisplay: string;
  productName?: string;
  rating: number;
  comment?: string;
  submittedAt: string;
};

export function useGetMerchantFeedbackReceived() {
  return useQuery({
    queryKey: ["stub", "merchant-feedback"] as const,
    queryFn: async (): Promise<MerchantFeedbackReceivedItem[]> => {
      const items: MerchantFeedbackReceivedItem[] = [];
      for (const [orderId, fb] of feedbackByOrder.entries()) {
        const order = mockOrders.find((o) => o.id === orderId);
        const clientDisplay = order
          ? [order.clientFirstName, order.clientLastName].filter(Boolean).join(" ").trim() || "Client"
          : "Client";
        items.push({
          orderId,
          trackingCode: order?.trackingCode ?? `CMD-${orderId}`,
          clientDisplay,
          productName: order?.product?.name,
          rating: fb.rating,
          comment: fb.comment,
          submittedAt: fb.submittedAt,
        });
      }
      items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      return items;
    },
  });
}

export function useGetFeedbackByOrder(orderId: number) {
  return useQuery({
    queryKey: ["stub", "feedback", orderId],
    enabled: orderId > 0,
    queryFn: async () => {
      const row = feedbackByOrder.get(orderId);
      if (!row) return null;
      return { rating: row.rating, comment: row.comment };
    },
  });
}

export function useSubmitFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { orderId: number; rating: number; comment?: string } }) => {
      feedbackByOrder.set(data.orderId, {
        rating: data.rating,
        comment: data.comment,
        submittedAt: new Date().toISOString(),
      });
      return { ok: true };
    },
    onSuccess: (_res, vars) => {
      void qc.invalidateQueries({ queryKey: ["stub", "feedback", vars.data.orderId] });
      void qc.invalidateQueries({ queryKey: ["stub", "merchant-feedback"] });
    },
  });
}

