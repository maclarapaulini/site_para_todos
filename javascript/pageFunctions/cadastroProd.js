import { supabase } from '../database/supaBase.js';

// Inicializa os ícones na tela
lucide.createIcons();

// Seleciona o formulário e o botão de submit pelo ID e Tag
const productForm = document.getElementById('product-form');
const submitButton = productForm.querySelector('button[type="submit"]');

// Escuta o evento de "submit" (quando o usuário clica em Salvar Produto)
productForm.addEventListener('submit', async (e) => {
    // Evita que a página recarregue (comportamento padrão do HTML)
    e.preventDefault();

    // Muda o texto do botão para dar feedback visual de carregamento
    const originalButtonContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Salvando...';
    submitButton.disabled = true;
    lucide.createIcons();

    // Captura os valores digitados nos inputs
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const base_price = parseFloat(document.getElementById('base_price').value);
    const image_url = document.getElementById('image_url').value;

    // Faz o INSERT no banco de dados do Supabase
    const { data, error } = await supabase
        .from('products')
        .insert([
            {
                name: name,
                description: description,
                base_price: base_price,
                image_url: image_url
            }
        ]);

    // Restaura o botão ao estado original
    submitButton.innerHTML = originalButtonContent;
    submitButton.disabled = false;
    lucide.createIcons();

    // Tratamento de Sucesso ou Erro
    if (error) {
        console.error("Erro ao cadastrar produto:", error);
        alert("Ops! Ocorreu um erro ao salvar o produto. Verifique o console.");
    } else {
        alert("Produto cadastrado com sucesso no catálogo!");
        // Limpa o formulário para o próximo cadastro
        productForm.reset();
    }
});