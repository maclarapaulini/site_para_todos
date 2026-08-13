import { supabase } from '../database/supaBase.js';

// Inicializa os ícones na tela
lucide.createIcons();

// Seleciona o formulário e o botão de submit pelo ID e Tag
const productForm = document.getElementById('product-form');
const submitButton = productForm.querySelector('button[type="submit"]');

// Escuta o evento de "submit" (quando o usuário clica em Salvar Produto)
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalButtonContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Salvando...';
    submitButton.disabled = true;
    lucide.createIcons();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const base_price = parseFloat(document.getElementById('base_price').value);
    
    // Pega o arquivo de imagem selecionado no input
    const fileInput = document.getElementById('image_file');
    const file = fileInput.files[0];

    try {
        // PASSO 1: Criar um nome único para a imagem (evita sobrepor imagens com mesmo nome)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `produtos/${fileName}`;

        // PASSO 2: Fazer o upload para o Supabase Storage (Bucket chamado 'imagens')
        const { error: uploadError } = await supabase.storage
            .from('imagens')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // PASSO 3: Pegar a URL pública da imagem que acabamos de subir
        const { data: publicUrlData } = supabase.storage
            .from('imagens')
            .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        // PASSO 4: Salvar os dados do produto na tabela
        const { error: insertError } = await supabase
            .from('products')
            .insert([{
                name: name,
                description: description,
                base_price: base_price,
                image_url: imageUrl
            }]);

        if (insertError) throw insertError;

        alert("Produto e imagem cadastrados com sucesso!");
        productForm.reset();

    } catch (error) {
        console.error("Erro durante o processo:", error);
        alert("Ops! Ocorreu um erro ao salvar o produto ou a imagem.");
    } finally {
        submitButton.innerHTML = originalButtonContent;
        submitButton.disabled = false;
        lucide.createIcons();
    }
});