import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface StudyHack {
  id: string;
  authorId?: string;
  authorName?: string;
  title: string;
  content: string;
  relatedWordId?: string;
  relatedUnitId?: number;
  tag: string;
  votesCount: number;
  status: "pending" | "approved" | "rejected" | "hidden";
  createdAt: string;
}

const DEFAULT_HACKS: StudyHack[] = [
  {
    id: "m-allot",
    title: "Allot (/əˈlɒt/)",
    content: "Think: 'A LOT'. The government owns 'a lot' of resources, so they need to allot (allocate) equal portions to each school.",
    tag: "Visual Hook",
    votesCount: 42,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-appall",
    title: "Appall (/əˈpɔːl/)",
    content: "Think: 'PALE'. The horrific crime made the detective turn completely pale with shock. It appalled him.",
    tag: "Emotion Hook",
    votesCount: 38,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-concur",
    title: "Concur (/kənˈkɜːr/)",
    content: "Roots: Latin 'con' (together) + 'currere' (to run). Two people whose ideas run along the exact same path concur with each other.",
    tag: "Etymology",
    votesCount: 29,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-cache",
    title: "Cache (/kæʃ/)",
    content: "Sounds identical to 'CASH'. Where do pirates hide their cash? In a secret underground cache!",
    tag: "Phonetic Hook",
    votesCount: 34,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-bizarre",
    title: "Bizarre (/bɪˈzɑːr/)",
    content: "Imagine walking into a traditional eastern 'bazaar' and seeing a blue dancing giraffe. That would be completely bizarre!",
    tag: "Visual Hook",
    votesCount: 25,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-deter",
    title: "Deter (/dɪˈtɜːr/)",
    content: "Think: 'DETOUR'. A huge security fence forces a burglar to take a detour, successfully deterring him from breaking in.",
    tag: "Visual Hook",
    votesCount: 31,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];

export async function getStudyHacks(): Promise<StudyHack[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("study_hacks")
        .select(`
          id, author_id, title, content, related_word_id, related_unit_id,
          tag, votes_count, status, created_at,
          profiles (display_name)
        `)
        .eq("status", "approved")
        .order("votes_count", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          authorId: d.author_id,
          authorName: d.profiles?.display_name || "IELTS Student",
          title: d.title,
          content: d.content,
          relatedWordId: d.related_word_id,
          relatedUnitId: d.related_unit_id,
          tag: d.tag,
          votesCount: d.votes_count,
          status: d.status,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch study hacks fallback:", e);
    }
  }

  // Local storage custom mnemonics merge
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem("ielts_custom_mnemonics");
      if (custom) {
        const parsed = JSON.parse(custom);
        const mappedCustom: StudyHack[] = parsed.map((m: any) => ({
          id: m.id,
          title: m.word,
          content: m.mnemonic,
          tag: m.tag || "Memory Hook",
          votesCount: 1,
          status: "approved",
          createdAt: new Date().toISOString(),
        }));
        return [...mappedCustom, ...DEFAULT_HACKS];
      }
    } catch (e) {}
  }

  return DEFAULT_HACKS;
}

export async function submitStudyHack(
  userId: string | undefined,
  hack: { title: string; content: string; tag: string; relatedWordId?: string }
): Promise<StudyHack> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("study_hacks")
        .insert({
          author_id: userId,
          title: hack.title,
          content: hack.content,
          tag: hack.tag,
          related_word_id: hack.relatedWordId || null,
          status: "approved",
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          authorId: data.author_id,
          title: data.title,
          content: data.content,
          tag: data.tag,
          votesCount: 0,
          status: data.status,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn("Supabase submit study hack fallback:", e);
    }
  }

  const fallback: StudyHack = {
    id: "custom-" + Date.now(),
    title: hack.title,
    content: hack.content,
    tag: hack.tag,
    votesCount: 1,
    status: "approved",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem("ielts_custom_mnemonics");
      const list = custom ? JSON.parse(custom) : [];
      list.unshift({
        id: fallback.id,
        word: hack.title,
        mnemonic: hack.content,
        tag: hack.tag,
        isUserCreated: true,
      });
      localStorage.setItem("ielts_custom_mnemonics", JSON.stringify(list));
    } catch (e) {}
  }

  return fallback;
}
