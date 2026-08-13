import { supabase } from '../database/supaBase.js';

// Inicializa os ícones
lucide.createIcons();

const tabelaProdutos = document.getElementById('tabela-produtos');

// Função para buscar e renderizar os produtos
async function loadProducts() {
    tabelaProdutos.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Carregando produtos...</td></tr>';

    const contadorHTML = document.getElementById('contador-produtos');

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true }); // Ordena em ordem alfabética

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        tabelaProdutos.innerHTML = '<tr><td colspan="5" class="text-center text-red-500 py-8">Erro ao carregar o estoque.</td></tr>';
        return;
    }

    tabelaProdutos.innerHTML = '';

    if (products.length === 0) {
        tabelaProdutos.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    if (contadorHTML) {
        const plural = products.length === 1 ? 'produto' : 'produtos';
        contadorHTML.textContent = `Mostrando ${products.length} ${plural}`;
    }

    products.forEach(product => {
        // Se a sua tabela não tiver controle de estoque ainda, vamos simular como 1
        const estoque = product.stock_quantity || 1; 
        
        // Define a tag de status visualmente
        const statusBadge = estoque > 0
            ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ativo
               </span>`
            : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Esgotado
               </span>`;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-orange-50/30 transition-colors';

        tr.innerHTML = `
            <td class="px-6 py-4 flex items-center gap-4">
                <img src="${product.image_url}" alt="${product.name}" class="w-12 h-12 rounded-lg object-cover shadow-sm">
                <div>
                    <p class="font-bold text-gray-800">${product.name}</p>
                </div>
            </td>
            <td class="px-6 py-4 font-medium text-coral">
                R$ ${Number(product.base_price).toFixed(2).replace('.', ',')}
            </td>
            <td class="px-6 py-4 text-center font-medium text-gray-700">
                ${estoque}
            </td>
            <td class="px-6 py-4 text-center">
                ${statusBadge}
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                    <button onclick="editProduct('${product.id}')" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Editar">
                        <i data-lucide="pencil" class="w-5 h-5"></i>
                    </button>
                    <button onclick="deleteProduct('${product.id}', '${product.name}')" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Excluir">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            </td>
        `;
        tabelaProdutos.appendChild(tr);
    });

    // Recria os ícones do Lucide após injetar o HTML dinâmico
    lucide.createIcons();
}

// Função para excluir do Supabase (Atrelada ao window para funcionar no onclick do HTML injetado)
window.deleteProduct = async function(id, name) {
    // Agora o alerta mostra o nome do produto dinamicamente
    if (!confirm(`Tem certeza que deseja excluir a peça "${name}"?\n\nEssa ação apagará o item permanentemente do catálogo.`)) {
        return;
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir:', error);
        alert(`Não foi possível excluir "${name}". A peça pode estar atrelada a um pedido existente no carrinho.`);
    } else {
        alert(`A peça "${name}" foi excluída com sucesso!`);
        loadProducts(); // Recarrega a tabela imediatamente para sumir com o produto da tela
    }
};

window.editProduct = function(id) {
    alert('A edição será implementada em seguida! ID do produto: ' + id);
};

// Executa a busca assim que a página carregar
loadProducts();