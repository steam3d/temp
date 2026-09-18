(() => {
    function init() {
        const tabSet = document.querySelector(".md-content .tabbed-set");

        if (!tabSet) return;

        const inputs = Array.from(
            tabSet.querySelectorAll(":scope > input")
        );

        const blocks = Array.from(
            tabSet.querySelectorAll(".tabbed-content > .tabbed-block")
        );

        if (!inputs.length || inputs.length !== blocks.length) return;

        const headingSets = blocks.map(block =>
            new Set(
                Array.from(
                    block.querySelectorAll("h2[id], h3[id], h4[id], h5[id], h6[id]")
                ).map(h => h.id)
            )
        );

        const allHeadings = new Set(
            headingSets.flatMap(set => Array.from(set))
        );

        function activeIndex() {
            return inputs.findIndex(input => input.checked);
        }

        function updateToc() {
            const index = activeIndex();

            if (index < 0) return;

            const activeHeadings = headingSets[index];

            document
                .querySelectorAll('.md-nav--secondary a[href^="#"]')
                .forEach(link => {
                    const id = decodeURIComponent(
                        link.getAttribute("href").slice(1)
                    );

                    if (!allHeadings.has(id)) return;

                    const item = link.closest(".md-nav__item");

                    if (!item) return;

                    item.hidden = !activeHeadings.has(id);
                });
        }

        function openTabForHeading(heading) {
            const index = blocks.findIndex(block =>
                block.contains(heading)
            );

            if (index < 0) return;

            if (!inputs[index].checked) {
                inputs[index].click();
            }

            updateToc();
        }

        function handleHash() {
            if (!location.hash) return;

            const id = decodeURIComponent(location.hash.slice(1));
            const heading = document.getElementById(id);

            if (!heading) return;

            openTabForHeading(heading);

            requestAnimationFrame(() => {
                heading.scrollIntoView();
            });
        }

        inputs.forEach(input => {
            input.addEventListener("change", updateToc);
        });

        document.addEventListener("click", event => {
            const link = event.target.closest(
                '.md-nav--secondary a[href^="#"]'
            );

            if (!link) return;

            const id = decodeURIComponent(
                link.getAttribute("href").slice(1)
            );

            const heading = document.getElementById(id);

            if (!heading) return;

            openTabForHeading(heading);
        });

        window.addEventListener("hashchange", handleHash);

        updateToc();
        handleHash();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();