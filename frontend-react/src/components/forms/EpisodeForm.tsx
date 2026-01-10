import { useState, useEffect } from "react";
import { Modal, Button, FormInput, FormTextarea } from "../ui";
import type { Episode } from "../../types/Episode";
type EpisodeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EpisodeFormData) => Promise<void>;
  episode?: Episode | null;
  seasonId: number;
};
export type EpisodeFormData = {
  title: string;
  episodeNumber: number;
  description?: string;
  duration: number;
  seasonId: number;
};
function EpisodeForm({
  isOpen,
  onClose,
  onSubmit,
  episode,
  seasonId,
}: EpisodeFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    episodeNumber: "",
    description: "",
    duration: "",
  });
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title,
        episodeNumber: String(episode.episodeNumber),
        description: episode.description ?? "",
        duration: String(episode.duration),
      });
    } else {
      setFormData({
        title: "",
        episodeNumber: "",
        description: "",
        duration: "",
      });
    }
  }, [episode, isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title: formData.title,
        episodeNumber: Number(formData.episodeNumber),
        description: formData.description || undefined,
        duration: Number(formData.duration),
        seasonId,
      });
      onClose();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={episode ? "Bölüm Düzenle" : "Yeni Bölüm Ekle"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Bölüm Başlığı"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <FormInput
          label="Bölüm Numarası"
          type="number"
          value={formData.episodeNumber}
          onChange={(e) =>
            setFormData({ ...formData, episodeNumber: e.target.value })
          }
          required
          min={1}
        />
        <FormInput
          label="Süre (Dakika)"
          type="number"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
          required
          min={1}
        />
        <FormTextarea
          label="Açıklama (Opsiyonel)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={submitting}
          >
            İptal
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? "Kaydediliyor..." : episode ? "Güncelle" : "Ekle"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export default EpisodeForm;