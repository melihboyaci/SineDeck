import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import api from "../../helper/api";
import { HiPencil } from "react-icons/hi";
import GenreSelector from "../../components/forms/GenreSelector";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormTextarea,
  Button,
  LoadingSpinner,
  PosterUpload,
} from "../../components/ui";

function EditSeries() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startYear: "",
    endYear: "",
    creator: "",
    posterUrl: "",
  });

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await api.get(`/series/${id}`);
        setFormData({
          title: response.data.title ?? "",
          description: response.data.description ?? "",
          startYear:
            response.data.startYear != null
              ? String(response.data.startYear)
              : "",
          endYear:
            response.data.endYear != null ? String(response.data.endYear) : "",
          creator: response.data.creator ?? "",
          posterUrl: response.data.posterUrl ?? "",
        });
        // Mevcut türleri yükle
        if (response.data.genres && response.data.genres.length > 0) {
          setSelectedGenreIds(
            response.data.genres.map((g: { id: number }) => g.id)
          );
        }
      } catch (error) {
        toast.error("Dizi yüklenirken hata oluştu!");
        navigate("/admin/series");
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [id, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/series/${id}`, {
        title: formData.title,
        description: formData.description,
        startYear: Number(formData.startYear),
        ...(formData.endYear
          ? { endYear: Number(formData.endYear) }
          : { endYear: null }),
        ...(formData.creator ? { creator: formData.creator } : {}),
        ...(formData.posterUrl ? { posterUrl: formData.posterUrl } : {}),
      });

      // Türleri güncelle
      await api.patch(`/series/${id}/genres`, { genreIds: selectedGenreIds });

      toast.success("Dizi başarıyla güncellendi!");
      navigate("/admin/series");
    } catch (error) {
      toast.error("Güncelleme başarısız.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Dizi yükleniyor..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Dizi Düzenle"
        subtitle="Dizi bilgilerini güncelleyin"
        icon={HiPencil}
        backUrl="/admin/series"
      />

      <FormCard onSubmit={handleSubmit}>
        <FormInput
          id="title"
          label="Dizi Adı"
          required
          value={formData.title}
          onChange={handleChange}
        />

        <FormTextarea
          id="description"
          label="Dizi Özeti"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <FormInput
          id="creator"
          label="Yapımcı / Yaratıcı"
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

        <GenreSelector
          selectedGenreIds={selectedGenreIds}
          onChange={setSelectedGenreIds}
        />

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
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </FormCard>
    </div>
  );
}

export default EditSeries;
