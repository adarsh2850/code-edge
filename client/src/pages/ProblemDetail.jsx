import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from '@monaco-editor/react';
import api from "../api/api";

function ProblemDetail(){
  const{id} = useParams();
  const [problem, setProblem] = useState(null);
  const[loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [submissionId, setSubmissionId] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [failedCase, setFailedCase] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get(`/problems/${id}`)
    .then((res) => {
      setProblem(res.data);
      setLoading(false);
    });
  }, [id]);
// fetch logic
  const fetchHistory = () => {
    api.get(`/submissions/problem/${id}`)
    .then((res) => setHistory(res.data))
    .catch((err) => console.error('Fetch history error:', err.message));
  };

  useEffect(() =>{
    fetchHistory();
  }, [id]);

useEffect(() => {
  if (!submissionId) return;

  let cancelled = false;

  const interval = setInterval(() => {
    api.get(`/submissions/${submissionId}`)
      .then((res) => {
        if (cancelled) return;
        console.log('Poll response:', res.data); // temporary debug line
        if (res.data.verdict !== 'PENDING') {
          setVerdict(res.data.verdict);
          setFailedCase(res.data.failedCase|| null);
          setSubmitting(false);
          clearInterval(interval);
          fetchHistory();
        }
      })
      .catch((err) => {
        console.error('Polling error:', err.message);
      });
  }, 2000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, [submissionId]);

  const handleSubmit = async() =>{
    setSubmitting(true);
    setVerdict(null);

    try{
      const res = await api.post('/submit', {code, problemId: id});
      setSubmissionId(res.data.submissionId);
      setVerdict('PENDING');
    } catch(err){
      setSubmitting(false);
      alert('Submission failed: ' + err.message);
    }
  };

  if(loading ) return <p>Loading...</p>;

  return (
    <div>
      <h1>{problem.title}</h1>
      <p>{problem.description}</p>

      <h3>Sample Test Cases</h3>
      <ul>
        {problem.testCases.slice(0, 2).map((tc) =>(
          <li key ={tc._id}>
            Input : <code>{tc.input}</code>  Expected: <code>{tc.expectedOutput}</code>
            </li>
        ))}
      </ul>

      <h3>Your Code</h3>
      <Editor
  height="400px"
  defaultLanguage="cpp"
  value={code}
  onChange={(value) => setCode(value || '')}
  theme="vs-dark"
  options={{ fontSize: 14, minimap: { enabled: false } }}
/>

        <br/>
        <button onClick={handleSubmit} disabled={submitting || !code}>
          {submitting ? 'Running...' : 'Submit'}
        </button>

        {verdict &&(
          <div>
            <p><strong>Verdict:</strong> {verdict}</p>
            {failedCase&& (
              <div>
                <p><strong>Failed on input:</strong><code>{failedCase.input}</code></p>
                <p><strong>Expected:</strong><code>{failedCase.expectedOutput}</code></p>
                <p><strong>Got:</strong><code>{failedCase.actualOutput}</code></p>
              </div>
            )}
          </div>
        )}

        <h3>Submission History</h3>
        {history.length === 0 ? (
          <p>No submission yet.</p>
        ) : (
          <ul>{history.map((sub) =>(
            <li key={sub._id}>
              {sub.verdict} - {new Date(sub.createdAt).toLocaleString()}
            </li>
          ))}
          </ul>
        )}
    </div>
  );
}
export default ProblemDetail