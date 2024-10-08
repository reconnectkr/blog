-- DropForeignKey
ALTER TABLE "categories_on_posts" DROP CONSTRAINT "categories_on_posts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categories_on_posts" DROP CONSTRAINT "categories_on_posts_postId_fkey";

-- AddForeignKey
ALTER TABLE "categories_on_posts" ADD CONSTRAINT "categories_on_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_on_posts" ADD CONSTRAINT "categories_on_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
