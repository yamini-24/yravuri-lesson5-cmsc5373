export async function protectedView() {
    const responce = await fetch('/view/templates/protected_page_template.html',
    {cache: 'no-store'});
    return await responce.text();
}