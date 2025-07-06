    // Sidebar open and close
    const openBtn = document.getElementById('open-sidebar-button');
    const closeBtn = document.getElementById('close-sidebar-button');
    const sidebar = document.getElementById('sidebar');

    openBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });

    // Toggle dropdown submenus
    const dropdownSelects = document.querySelectorAll('.dropdown .select');
    dropdownSelects.forEach(select => {
      select.addEventListener('click', (e) => {
        // Prevent sidebar from closing if clicking on a link inside the submenu
        if (e.target.tagName.toLowerCase() !== 'a') {
          select.classList.toggle('open');
        }
      });
    });
    document.addEventListener('DOMContentLoaded', () => {
  // Copyright notice
  const year = new Date().getFullYear();
  const noticeText = `© ${year} Marvel Digest. All rights reserved.`;
  document.getElementById('copyright-notice').innerText = noticeText;
});
// msn SCRIPT: fetch posts.json & render cards

    document.addEventListener("DOMContentLoaded", () => {
      const feedContainer = document.getElementById("feed");
      const template = document.getElementById("post-card-template");

      // Fetch the JSON feed (must live at /posts.json)
      fetch("/posts.json")
        .then((res) => {
          if (!res.ok) throw new Error("Could not load posts.json");
          return res.json();
        })
        .then((posts) => {
          // Sort by publishDate (newest first)
          posts.sort(
            (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
          );

          posts.forEach((post) => {
            // Clone the template
            const clone = template.content.cloneNode(true);

            // (1) Featured image
            const imgEl = clone.querySelector(".featured");
            imgEl.src = post.featuredImageUrl;
            imgEl.alt = post.title;

            // (2) Author logo + name
            const authorLogo = clone.querySelector(".author-logo");
            authorLogo.src = post.authorLogoUrl;
            authorLogo.alt = post.author + " logo";
            clone.querySelector(".author-name").textContent = post.author;

            // (3) Title + link
            const titleLink = clone.querySelector(".title");
            titleLink.textContent = post.title;
            titleLink.href = post.postUrl;

            // (4) Like / Dislike counts
            clone.querySelector(".like-count").textContent = post.likeCount;
            clone.querySelector(".dislike-count").textContent = post.dislikeCount;

            // (5) Optional: increment counts on click (client‐side only)
            clone.querySelector(".like-btn").addEventListener("click", (e) => {
              e.preventDefault();
              const countEl = clone.querySelector(".like-count");
              countEl.textContent = parseInt(countEl.textContent) + 1;
            });
            clone
              .querySelector(".dislike-btn")
              .addEventListener("click", (e) => {
                e.preventDefault();
                const countEl = clone.querySelector(".dislike-count");
                countEl.textContent = parseInt(countEl.textContent) + 1;
              });

            // Append this card into the feed
            feedContainer.appendChild(clone);
          });
        })
        .catch((err) => {
          console.error("Error loading posts:", err);
          feedContainer.innerHTML = "<p>Could not load posts at this time.</p>";
        });
    });
    //msn end
  


