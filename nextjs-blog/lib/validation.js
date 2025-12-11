/**
 * Utilidades de validación y seguridad para la API
 * Centraliza todas las validaciones para mantener consistencia
 */

// ============================================
// CONSTANTES DE SEGURIDAD
// ============================================
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_TITLE_LENGTH = 200;
export const MAX_CONTENT_LENGTH = 50000;

// Regex para validar UUID v4 (formato de IDs de Supabase)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Valida que el ID sea un UUID válido
 * @param {string} id - ID a validar
 * @returns {boolean}
 */
export function isValidUUID(id) {
	return typeof id === 'string' && UUID_REGEX.test(id);
}

/**
 * Valida que el archivo sea una imagen permitida
 * @param {File} file - Archivo a validar
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImage(file) {
	// Validar que exista el archivo
	if (!file?.name || !file?.type) {
		return { valid: false, error: 'Archivo de imagen inválido' };
	}

	// Validar tipo MIME
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return { 
			valid: false, 
			error: 'Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, GIF, WEBP' 
		};
	}

	// Validar extensión (doble verificación contra spoofing de MIME)
	const ext = file.name.split('.').pop()?.toLowerCase();
	if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
		return { valid: false, error: 'Extensión de archivo no permitida' };
	}

	// Validar tamaño
	if (file.size > MAX_FILE_SIZE) {
		const maxMB = MAX_FILE_SIZE / (1024 * 1024);
		return { valid: false, error: `El archivo es demasiado grande. Máximo ${maxMB}MB` };
	}

	// Validar que el tamaño sea mayor a 0 (archivo no vacío)
	if (file.size === 0) {
		return { valid: false, error: 'El archivo está vacío' };
	}

	return { valid: true };
}

/**
 * Sanitiza y valida el texto de entrada
 * @param {string} text - Texto a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @param {string} fieldName - Nombre del campo (para mensajes de error)
 * @returns {{ valid: boolean, value?: string, error?: string }}
 */
export function sanitizeText(text, maxLength, fieldName = 'campo') {
	// Validar que sea string
	if (text === null || text === undefined) {
		return { valid: false, error: `El ${fieldName} es requerido`, value: null };
	}

	if (typeof text !== 'string') {
		return { valid: false, error: `El ${fieldName} debe ser texto`, value: null };
	}

	// Eliminar espacios al inicio y final
	const trimmed = text.trim();

	// Validar que no esté vacío
	if (trimmed.length === 0) {
		return { valid: false, error: `El ${fieldName} no puede estar vacío`, value: null };
	}

	// Validar longitud máxima
	if (trimmed.length > maxLength) {
		return { 
			valid: false, 
			error: `El ${fieldName} excede el límite de ${maxLength} caracteres`, 
			value: null 
		};
	}

	return { valid: true, value: trimmed };
}

/**
 * Obtiene la extensión segura de un archivo
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Extensión en minúsculas
 */
export function getSafeExtension(filename) {
	const ext = filename.split('.').pop()?.toLowerCase();
	// Solo devolver si es una extensión permitida
	if (ext && ALLOWED_EXTENSIONS.includes(ext)) {
		return ext;
	}
	return 'jpg'; // Fallback seguro
}

