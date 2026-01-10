import { useState, useEffect } from "react";
import { Modal, Button, FormInput, FormTextarea } from "../ui";
import type { Season } from "../../types/Season";
type SeasonFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SeasonFormData) => Promise<void>;
  season?: Season | null;
  seriesId: number;
};
export type SeasonFormData = {
  seasonNumber: number;
  description?: string;
  seriesId: number;
};
function SeasonForm({
  isOpen,
  onClose,
  onSubmit,
  season,
  seriesId,
}: SeasonFormProps) {
  const [formData, setFormData] = useState({
    seasonNumber: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (season) {
      setFormData({
        seasonNumber: String(season.seasonNumber),
        description: season.description ?? "",
      });
    } else {
      setFormData({
        seasonNumber: "",
        description: "",
      });
    }
  }, [season, isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        seasonNumber: Number(formData.seasonNumber),
        description: formData.description || undefined,
        seriesId,
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
      title={season ? "Sezon Düzenle" : "Yeni Sezon Ekle"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Sezon Numarası"
          type="number"
          value={formData.seasonNumber}
          onChange={(e) =>
            setFormData({ ...formData, seasonNumber: e.target.value })
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
            {submitting ? "Kaydediliyor..." : season ? "Güncelle" : "Ekle"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export default SeasonForm;