import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";
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
function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    director: "",
    releaseYear: "",
    posterUrl: "",
  });
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setFormData({
          title: response.data.title ?? "",
          description: response.data.description ?? "",
          director: response.data.director ?? "",
          releaseYear:
            response.data.releaseYear != null
              ? String(response.data.releaseYear)
              : "",
          posterUrl: response.data.posterUrl || "",
        });
        if (response.data.genres) {
          setSelectedGenreIds(
            response.data.genres.map((g: { id: number }) => g.id)
          );
        }
      } catch (error) {
        toast.error("Film yüklenirken hata oluştu!");
        navigate("/admin/movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, navigate]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/movies/${id}`, {
        title: formData.title,
        director: formData.director,
        description: formData.description,
        releaseYear: Number(formData.releaseYear),
        ...(formData.posterUrl ? { posterUrl: formData.posterUrl } : {}),
      });
      await api.patch(`/movies/${id}/genres`, {
        genreIds: selectedGenreIds,
      });
      toast.success("Film başarıyla güncellendi!");
      navigate("/admin/movies");
    } catch (error) {
      toast.error("Güncelleme başarısız.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <LoadingSpinner message="Film yükleniyor..." />;
  }
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Film Düzenle"
        subtitle="Film bilgilerini güncelleyin"
        icon={HiPencil}
        backUrl="/admin/movies"
      />
      <FormCard onSubmit={handleSubmit}>
        <FormInput
          id="title"
          label="Film Adı"
          required
          value={formData.title}
          onChange={handleChange}
        />
        <FormTextarea
          id="description"
          label="Film Özeti"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="director"
            label="Yönetmen"
            required
            value={formData.director}
            onChange={handleChange}
          />
          <FormInput
            id="releaseYear"
            label="Vizyon Yılı"
            type="number"
            required
            value={formData.releaseYear}
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
            onClick={() => navigate("/admin/movies")}
          >
            İptal
          </Button>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </FormCard>
    </div>
  );
}
export default EditMovie;