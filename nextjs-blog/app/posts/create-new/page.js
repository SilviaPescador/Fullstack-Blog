import Layout from '@/components/layout';
import NewPostCard from '@/components/newPostCard';

export const metadata = {
	title: 'Nuevo Post - Spelkit Blog',
};

export default function CreateNew() {
	return (
		<Layout>
			<NewPostCard />
		</Layout>
	);
}

