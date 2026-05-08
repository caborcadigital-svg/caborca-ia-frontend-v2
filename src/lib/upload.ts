const UPLOAD_URL = 'https://caborca.app/upload.php';
const UPLOAD_TOKEN = 'CABORCA_UPLOAD_2024_SECRETO';

export async function subirImagen(archivo: File): Promise<string> {
  const formData = new FormData();
  formData.append('imagen', archivo);

  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: { 'X-Upload-Token': UPLOAD_TOKEN },
    body: formData,
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error subiendo imagen');
  return data.url;
}
