"""Run the FastMCP server via SSE transport on port 8001."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mcp_travelmate.server import mcp

if __name__ == "__main__":
    print("Starting TravelMate MCP Server on http://localhost:8001/sse")
    mcp.run(transport="sse")
