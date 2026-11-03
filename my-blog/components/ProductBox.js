export default function ProductBox({ p }) {
  return (
    <div className="pbox">
      <div className="pbox-top"><strong>{p.name}</strong><span>{p.price}</span></div>
      <div className="pc">
        <ul className="pro">{p.pros.map((x) => <li key={x}>{x}</li>)}</ul>
        <ul className="con">{p.cons.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <a className="btn" href={p.link} target="_blank" rel="sponsored nofollow noopener">Check price</a>
    </div>
  );
}
