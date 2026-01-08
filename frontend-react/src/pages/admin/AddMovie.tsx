import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../helper/api";
import { HiFilm } from "react-icons/hi";
import GenreSelector from "../../components/forms/GenreSelector";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormTextarea,
  Button,
  PosterUpload,
} from "../../components/ui";

function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    director: "",
    releaseYear: String(new Date().getFullYear()),
    posterUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/movies", {
        title: formData.title,
        description: formData.description,
        director: formData.director,
        releaseYear: Number(formData.releaseYear),
        ...(formData.posterUrl ? { posterUrl: formData.posterUrl } : {}),
      });

      // Türleri ata
      if (selectedGenreIds.length > 0) {
        await api.patch(`/movies/${response.data.id}/genres`, {
          genreIds: selectedGenreIds,
        });
      }

      toast.success("Film başarıyla eklendi");
      navigate("/admin/movies");
    } catch (error) {
      console.error(error);
      toast.error("Film eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Yeni Film Ekle"
        subtitle="Film bilgilerini girin"
        icon={HiFilm}
        backUrl="/admin/movies"
      />

      <FormCard onSubmit={handleSubmit}>
        <FormInput
          id="title"
          label="Film Adı"
          placeholder="Örn: The Matrix"
          required
          value={formData.title}
          onChange={handleChange}
        />

        <FormTextarea
          id="description"
          label="Film Özeti"
          placeholder="Filmin konusu nedir?"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="director"
            label="Yönetmen"
            placeholder="Christopher Nolan"
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
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Kaydediliyor..." : "Filmi Kaydet"}
          </Button>
        </div>
      </FormCard>
    </div>
  );
}

export default AddMovie;
