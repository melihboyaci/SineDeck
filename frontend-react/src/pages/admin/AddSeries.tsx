import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../helper/api";
import { HiFilm } from "react-icons/hi";
import GenreSelector from "../../components/admin/GenreSelector";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormTextarea,
  Button,
  PosterUpload,
} from "../../components/ui";

function AddSeries() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startYear: String(new Date().getFullYear()),
    endYear: "",
    creator: "",
    posterUrl: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/series", {
        title: formData.title,
        startYear: Number(formData.startYear),
        ...(formData.description ? { description: formData.description } : {}),
        ...(formData.endYear ? { endYear: Number(formData.endYear) } : {}),
        ...(formData.creator ? { creator: formData.creator } : {}),
        ...(formData.posterUrl ? { posterUrl: formData.posterUrl } : {}),
      });

      // Türleri ata
      if (selectedGenreIds.length > 0) {
        await api.patch(`/series/${response.data.id}/genres`, {
          genreIds: selectedGenreIds,
        });
      }

      toast.success("Dizi başarıyla eklendi");
      navigate("/admin/series");
    } catch (error) {
      console.error(error);
      toast.error("Dizi eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Yeni Dizi Ekle"
        subtitle="Dizi bilgilerini girin"
        icon={HiFilm}
        backUrl="/admin/series"
      />

      <FormCard onSubmit={handleSubmit}>
        <FormInput
          id="title"
          label="Dizi Adı"
          placeholder="Örn: Breaking Bad"
          required
          value={formData.title}
          onChange={handleChange}
        />

        <FormTextarea
          id="description"
          label="Dizi Özeti"
          placeholder="Dizinin konusu nedir?"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <FormInput
          id="creator"
          label="Yapımcı / Yaratıcı"
          placeholder="Örn: Vince Gilligan"
          optional
          value={formData.creator}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="startYear"
            label="Başlangıç Yılı"
            type="number"
            required
            value={formData.startYear}
            onChange={handleChange}
          />
          <FormInput
            id="endYear"
            label="Bitiş Yılı"
            type="number"
            placeholder="Devam ediyorsa boş bırakın"
            optional
            value={formData.endYear}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Türler
          </label>
          <GenreSelector
            selectedGenreIds={selectedGenreIds}
            onChange={setSelectedGenreIds}
          />
        </div>

        <PosterUpload
          value={formData.posterUrl}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, posterUrl: url }))
          }
          label="Afiş"
        />

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/series")}
          >
            İptal
          </Button>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Kaydediliyor..." : "Diziyi Kaydet"}
          </Button>
        </div>
      </FormCard>
    </div>
  );
}

export default AddSeries;
