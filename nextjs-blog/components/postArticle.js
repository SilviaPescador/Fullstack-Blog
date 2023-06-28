import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import formatDate from "../common/formatDate";

export default function PostArticle({ postData }) {
	const [truncatedContent, setTruncatedContent] = useState("");
	const friendlyDate = formatDate(postData.post_date);

	useEffect(() => {
		if (postData.content.length > 50) {
			setTruncatedContent(postData.content.substring(0, 50) + "...");
		} else {
			setTruncatedContent(postData.content);
		}
	}, []);
	const handleDelete = async (id) => {
		alert("deleted " + id);
	};

	return (
		<article className="card rounded mt-3 mx-3 shadow">
			{/** IMAGE (if not null) */}
			{postData.image ? (
				<div className="d-flex justify-content-center rounded">
					<Image
						priority
						src={postData.image}
						className="img-fluid rounded-4 p-1 border border-dark mt-3"
						height={300}
						width={300}
						alt=""
					/>
				</div>
			) : null}
			{/** TITLE + POST_DATE */}
			<div className="d-flex justify-content-between mx-3 align-items-center p-2">
				<Link href="/">
					<h2 className="card-title">{postData.title}</h2>
				</Link>
				<p>{friendlyDate}</p>
			</div>
			{/** POST CONTENT */}
			<div className="card-body mx-3">
				<p>{truncatedContent}</p>
			</div>
			{/** FOOTER - BUTTONS */}
			<div className="card-footer d-flex justify-content-end">
				<button
					className="btn"
					title="Delete this post"
					onClick={() => handleDelete(postData.id)}
				>
					<i className="bi bi-x-lg"></i>
				</button>
			</div>
		</article>
	);
}
